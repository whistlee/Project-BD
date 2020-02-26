-- FUNKCJA DO SPRAWDZENIA CZY NUMER WAGONU MA ODPOWIEDNIA DLUGOSC
CREATE OR REPLACE FUNCTION valid_number()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    IF LENGTH(CAST(NEW.numer_wagonu AS VARCHAR)) != 7 THEN
        RAISE EXCEPTION 'Numer musi miec 7 cyfr.';
    END IF;
    RETURN NEW;
END;
$$;
-- WYZWALACZ DLA WAGONU NA TORZE
CREATE TRIGGER wagon_valid
    AFTER INSERT OR UPDATE OR DELETE
    ON wagony_na_torze
    FOR EACH ROW
EXECUTE PROCEDURE valid_number();


-- FUNKCJA DO SPRAWDZENIA CZY NUMER STARTOWY I KONCOWY MA ODPOWIEDNIA DLUGOSC
CREATE OR REPLACE FUNCTION valid_number_wagony_bazowy()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    IF LENGTH(CAST(NEW.nr_startowy AS VARCHAR)) != 7 AND LENGTH(CAST(NEW.nr_koncowy AS VARCHAR)) != 7 THEN
        RAISE EXCEPTION 'Numer musi miec 7 cyfr.';
    END IF;
    RETURN NEW;
END;
$$;
-- WYZWALACZ DLA WAGONU BAZOWEGO
CREATE TRIGGER wagon_bazowy_valid
    AFTER INSERT OR UPDATE OR DELETE
    ON wagony
    FOR EACH ROW
EXECUTE PROCEDURE valid_number_wagony_bazowy();

-- FUNKCJA DO SPRAWDZENIA CZY WAGON JEST NA TORZE
CREATE OR REPLACE FUNCTION sprawdz_czy_istnieje(sprawdz_numer int)
    RETURNS boolean
    LANGUAGE plpgsql
AS
$$
DECLARE
    b boolean;
BEGIN
    SELECT INTO b EXISTS(SELECT 1 from wagony_na_torze where numer_wagonu = $1 AND opuscil_tor = FALSE);
    return b;
END;
$$;

-- FUNCKJA DO WYBRANIA W_ID W TABELI WAGONY NA TORZE PO PODANIU NUMER WAGONU
-- SZUKA W_ID W TABELI WAGONY KTORA ZAWIERA PRZEDZIALY NUMEROW WAGONOW
CREATE OR REPLACE FUNCTION wybierz_id(numer_wagonu INT) RETURNS integer AS
$$
DECLARE
    wagon_id integer;
BEGIN
    -- wiersze za zapytania
    SELECT INTO wagon_id wagony.w_id FROM wagony WHERE (wagony.nr_startowy <= $1 AND $1 <= wagony.nr_koncowy);

    RETURN wagon_id;
END;
$$ LANGUAGE 'plpgsql';

-- TWORZY WAGON NA PODANYM TORZE
CREATE OR REPLACE FUNCTION nowy_wagon(tory_id integer, aktualny_numer integer)
    RETURNS void
AS
$$
BEGIN
    INSERT INTO wagony_na_torze(w_id, t_id, numer_wagonu, czas_wjazdu)
    values (wybierz_id($2), $1, $2, NOW());
END;
$$ LANGUAGE plpgsql;

-- Funkcja do zmiany wartosci opusc_bocznice na TRUE zwracajaca true/false w
-- zaleznosci czy operacja przebiegla pomyslnie
CREATE OR REPLACE FUNCTION opusc_bocznice(wagon_na_torze integer)
    RETURNS boolean
AS
$$
DECLARE
    b boolean := FALSE;
BEGIN
    IF sprawdz_czy_istnieje(wagon_na_torze) THEN
        UPDATE wagony_na_torze
        SET czas_wyjazdu=NOW(),
            czas_na_torze=AGE(NOW(), czas_wjazdu),
            opuscil_tor = TRUE
        WHERE numer_wagonu = wagon_na_torze;
        b := TRUE;
        return b;
    END IF;
    return b;
END;
$$ LANGUAGE plpgsql;

-- FUNCKJA ZWRACAJCA ID BOCZNICY O PODANEJ NAZWIE, NUMERZE TORU ORAZ ID UZYTKOWNIKA
CREATE OR REPLACE FUNCTION bocznica_id(nazwa_bocznicy varchar, numer_toru integer, u_id integer)
    RETURNS integer
AS
$$
DECLARE
    bocznica_id integer;
BEGIN
    SELECT INTO bocznica_id b.b_id
    FROM tory t,
         bocznica b
    WHERE t.numer = $2
      AND t.b_id = b.b_id
      AND b.nazwa = $1
      AND b.u_id = $3;
    return bocznica_id;
END;
$$ LANGUAGE plpgsql;

-- FUNCKJA ZWRACAJCA ID TORU O PODANEJ NAZWIE, NUMERZE TORU ORAZ ID UZYTKOWNIKA
CREATE OR REPLACE FUNCTION tor_id(nazwa_bocznicy varchar, numer_toru integer, u_id integer)
    RETURNS integer
AS
$$
DECLARE
    tor_id integer;
BEGIN
    SELECT INTO tor_id t.t_id
    FROM tory t
    WHERE t.numer = $2
      AND t.b_id = bocznica_id($1, $2, $3);
    return tor_id;
END;
$$ LANGUAGE plpgsql;

-- FUNCKJA ZWRACAJCA ILE TORU JEST WOLNEGO
CREATE OR REPLACE FUNCTION zajetosc_toru(nazwa_bocznicy varchar, numer_toru integer, u_id integer)
    RETURNS integer
AS
$$
DECLARE
    zajetosc        integer;
    dlugosc_wagonow integer;
BEGIN
    SELECT INTO zajetosc t.dlugosc
    FROM tory t
    WHERE t.b_id = bocznica_id($1, $2, $3)
      AND t.numer = $2;
    SELECT INTO dlugosc_wagonow COALESCE(SUM(w.dlugosc), 0)
    FROM wagony w,
         wagony_na_torze wt
    WHERE w.w_id = wt.w_id
      AND wt.opuscil_tor = FALSE
      AND wt.t_id = tor_id($1, $2, $3);
    zajetosc := zajetosc - dlugosc_wagonow;
    return zajetosc;
END;
$$ LANGUAGE plpgsql;

-- FUNCKJA ZWRACAJACA TABLICE OBIEKTOW JSON ZAWIERAJACYCH DANE FIRMY I POWIAZANE Z NIA ADRESY
CREATE OR REPLACE FUNCTION wyswietl_firme(firma_NIP integer) RETURNS SETOF json AS
$$
BEGIN
    RETURN QUERY
        SELECT json_agg(json_build_object('nazwa', f.nazwa, 'telefon', f.telefon, 'NIP', f.NIP, 'adres', a.adres,
                                          'miasto',
                                          a.miasto, 'kraj', a.kraj, 'kod_pocztowy', a.kod_pocztowy) ORDER BY f.nazwa)
        FROM firmy f
                 LEFT JOIN adres a ON f.adres_id = a.adres_id
        WHERE f.NIP = $1;
END;
$$ LANGUAGE plpgsql;

-- PROTIP NIE ROBIC json_agg bo pascal jakis dziwny i parsuje jeszcze raz
CREATE OR REPLACE VIEW wyswietl_tory AS
SELECT json_agg(json_build_object('nazwa', b.nazwa, 'dlugosc', t.dlugosc, 'numer', t.numer, 'zajetosc',
                                  zajetosc_toru(b.nazwa, t.numer)))
FROM tory t
         LEFT JOIN bocznica b ON b.b_id = t.b_id;

--FUNKCJA ZWRACAJCA TORY DANEGO UZYTKOWNIKA I ICH ZAJETOSC
CREATE OR REPLACE FUNCTION wyswietl_tory(u_id integer) RETURNS SETOF json AS
$$
BEGIN
    RETURN QUERY
        SELECT json_agg(json_build_object('nazwa', b.nazwa, 'dlugosc', t.dlugosc, 'numer', t.numer, 'zajetosc',
                                          zajetosc_toru(b.nazwa, t.numer, $1)) ORDER BY b.nazwa,t.numer)
        FROM tory t
                 LEFT JOIN bocznica b ON t.b_id = b.b_id
        where b.u_id = $1;
END;
$$ LANGUAGE plpgsql;

--FUNKCJA DODAJACA ID FIRMY DLA DANEGO UZYTKOWNIKA
CREATE OR REPLACE FUNCTION dodaj_firme_uzytkownika(firma_NIP integer, uzytkownik_id integer) RETURNS boolean AS
$$
DECLARE
    b        boolean := FALSE;
    firma_id integer;
BEGIN
    SELECT INTO b EXISTS(SELECT f.f_id FROM firmy f WHERE f.NIP = $1);
    IF b THEN
        firma_id := (SELECT f.f_id FROM firmy f WHERE f.NIP = $1);
        UPDATE uzytkownik SET f_id = firma_id WHERE u_id = $2;
        return b;
    END IF;
    return b;
END;
$$ LANGUAGE plpgsql;

--FUNKCJA AKTUALIZUJACA TABLICE WAGONOW O ID PODANEJ FIRMY
CREATE OR REPLACE FUNCTION dodaj_firme_wagonow(firma_NIP integer, nazwa_firmy text) RETURNS boolean AS
$$
DECLARE
    b        boolean := FALSE;
    b1       boolean := FALSE;
    firma_id integer;
BEGIN
    SELECT INTO b EXISTS(SELECT f.f_id FROM firmy f WHERE f.NIP = $1);
    IF b THEN
        SELECT INTO b1 EXISTS(SELECT w.wlasciciel FROM wagony w WHERE w.wlasciciel = $2);
        firma_id := (SELECT f.f_id FROM firmy f WHERE f.NIP = $1);
        if b1 THEN
            UPDATE wagony SET f_id = firma_id WHERE wlasciciel = $2;
            return b1;
        end if;
        return b1;
    END IF;
    return b;
END;
$$ LANGUAGE plpgsql;

-- ZWRACA CZAS CALKOIWTY NA TORZE I OPLATY DLA KAZDEJ FIRMY
CREATE OR REPLACE FUNCTION podsumowanie_torow(u_id integer, cena integer) RETURNS SETOF json AS
$$
BEGIN
    CREATE TEMP TABLE IF NOT EXISTS temp_table AS
    SELECT w.wlasciciel                                            AS firma,
           SUM(wt.czas_na_torze)                                   AS czas_calkowity,
           (EXTRACT(epoch FROM SUM(wt.czas_na_torze)) / 3600) * $2 AS koszt
    FROM wagony w,
         wagony_na_torze wt,
         tory t,
         bocznica b
    WHERE wt.w_id = w.w_id
      AND wt.t_id = t.t_id
      AND b.u_id = $1
      AND t.b_id = b.b_id
    GROUP BY w.wlasciciel;
    RETURN QUERY
        SELECT json_agg(json_build_object('firma', firma, 'czas_calkowity', czas_calkowity, 'koszt', koszt))
        FROM temp_table;
    DROP TABLE temp_table;
end;
$$ LANGUAGE plpgsql;

--WIDOK WSZYSTKICH FIRM W JSON
CREATE OR REPLACE VIEW wyswietl_firmy AS
SELECT json_agg(json_build_object('nazwa', f.nazwa, 'telefon', f.telefon, 'NIP', f.NIP, 'email', f.email, 'adres',
                                  a.adres, 'miasto',
                                  a.miasto, 'kraj', a.kraj, 'kod_pocztowy', a.kod_pocztowy) ORDER BY f.nazwa)
FROM firmy f
         LEFT JOIN adres a ON f.adres_id = a.adres_id;

-- WIDOK WSZYSTKICH WAGONOW BAZOWYCH W JSON
CREATE OR REPLACE VIEW wyswietl_wagony_bazowe AS
SELECT json_agg(json_build_object('nazwa', w.nazwa, 'nr_startowy', w.nr_startowy, 'nr_koncowy', w.nr_koncowy, 'dlugosc',
                                  w.dlugosc, 'wlasciciel',
                                  w.wlasciciel, 'typ_wagonu', w.typ_wagonu))
FROM wagony w;

