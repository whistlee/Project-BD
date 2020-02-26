CREATE TABLE adres
(
    adres_id     SERIAL  NOT NULL PRIMARY KEY,
    adres        VARCHAR NOT NULL,
    miasto       VARCHAR NOT NULL,
    kraj         VARCHAR NOT NULL,
    kod_pocztowy VARCHAR NOT NULL
);
CREATE TABLE firmy
(
    f_id     SERIAL     NOT NULL PRIMARY KEY,
    adres_id INT        NOT NULL,
    nazwa    VARCHAR    NOT NULL,
    telefon  INT        NOT NULL,
    NIP      INT UNIQUE NOT NULL,
    email    VARCHAR,
    CONSTRAINT firmy_adres_id_fkey FOREIGN KEY (adres_id)
        REFERENCES adres (adres_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE SET NULL
);

CREATE TABLE uzytkownik
(
    u_id              SERIAL             NOT NULL PRIMARY KEY,
    email_uzytkownika VARCHAR            NOT NULL,
    nazwa_uzytkownika VARCHAR(20) UNIQUE NOT NULL,
    haslo             VARCHAR(20)        NOT NULL,
    f_id              INT,
    CONSTRAINT uzytkownik_f_id_fkey FOREIGN KEY (f_id)
        REFERENCES firmy (f_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE SET NULL
);
CREATE TABLE wagony
(
    w_id        SERIAL  NOT NULL PRIMARY KEY,
    nazwa       VARCHAR NOT NULL,
    nr_startowy INT     NOT NULL,
    nr_koncowy  INT     NOT NULL,
    dlugosc     INT     NOT NULL,
    wlasciciel  VARCHAR NOT NULL,
    typ_wagonu  VARCHAR NOT NULL,
    f_id        INT,
    CONSTRAINT uzytkownik_f_id_fkey FOREIGN KEY (f_id)
        REFERENCES firmy (f_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE SET NULL
);


CREATE TABLE bocznica
(
    b_id  SERIAL  NOT NULL PRIMARY KEY,
    u_id  INT     NOT NULL,
    nazwa VARCHAR NOT NULL,
    CONSTRAINT bocznica_u_id_fkey FOREIGN KEY (u_id)
        REFERENCES uzytkownik (u_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE tory
(
    t_id    SERIAL NOT NULL PRIMARY KEY,
    b_id    INT    NOT NULL,
    dlugosc INT    NOT NULL,
    numer   INT    NOT NULL,
    CONSTRAINT tory_b_id_fkey FOREIGN KEY (b_id)
        REFERENCES bocznica (b_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE wagony_na_torze
(
    wt_id         SERIAL NOT NULL PRIMARY KEY,
    w_id          INT,
    t_id          INT    NOT NULL,
    numer_wagonu  INT    NOT NULL,
    czas_wjazdu   TIMESTAMP,
    czas_wyjazdu  TIMESTAMP,
    czas_na_torze INTERVAL,
    opuscil_tor   BOOLEAN DEFAULT 'f',
    CONSTRAINT wagony_na_torze_w_id_fkey FOREIGN KEY (w_id)
        REFERENCES wagony (w_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT wagony_na_torze_t_id_fkey FOREIGN KEY (t_id)
        REFERENCES tory (t_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE CASCADE
);





INSERT INTO adres(adres, miasto, kraj, kod_pocztowy)
values ('Kolejowa 43', 'Warszawa', 'Polska', '48-321');
INSERT INTO adres(adres, miasto, kraj, kod_pocztowy)
values ('Paliwowa 43', 'Warszawa', 'Polska', '48-321');
INSERT INTO firmy(adres_id, nazwa, telefon, NIP, email)
values (1, 'PKP Cargo', 698243213, 1234512341, 'pkpcargo@cargo.pl');
INSERT INTO firmy(adres_id, nazwa, telefon, NIP, email)
values (2, 'Lotos', 698243213, 1234512343, 'lotos@lotos.pl');
INSERT INTO uzytkownik(email_uzytkownika, nazwa_uzytkownika, haslo, f_id)
values ('admin@admin.pl', 'admin', 'admin', 1);
INSERT INTO bocznica(u_id, nazwa)
values (1, 'bocznica1');
INSERT INTO tory(b_id, dlugosc, numer)
values (1, 100000, 1);

insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id, f_id)
values ('Es', 5522295, 5549519, 10000, 'PKP cargo', 'Weglarka budowy normalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Eamos', 5940000, 5945912, 12240, 'PKP cargo', 'Weglarka budowy normalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Eams', 5993000, 5994045, 12240, 'PKP cargo', 'Weglarka budowy normalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Eans', 5419000, 5419614, 15740, 'PKP cargo', 'Weglarka budowy normalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Eas', 5950021, 5978952, 14040, 'PKP cargo', 'Weglarka budowy normalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Eaaos', 5378001, 5378098, 16210, 'PKP cargo', 'Weglarka budowy normalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Eaos', 5302006, 5400436, 14040, 'PKP cargo', 'Weglarka budowy normalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Eanos', 5375300, 5375499, 14040, 'PKP cargo', 'Weglarka budowy normalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Fas', 6738903, 6739982, 14040, 'PKP cargo', 'Weglarka budowy specjalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Fa', 6700000, 6701007, 12540, 'PKP cargo', 'Weglarka budowy specjalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Falns', 6635105, 6637178, 14040, 'PKP cargo', 'Weglarka budowy specjalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Fals', 6650007, 6659999, 13500, 'PKP cargo', 'Weglarka budowy specjalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Facc', 6891025, 6892128, 11190, 'PKP cargo', 'Weglarka budowy specjalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Fls', 6250503, 6251747, 9640, 'PKP cargo', 'Weglarka budowy specjalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Flls', 6276000, 6278373, 9140, 'PKP cargo', 'Weglarka budowy specjalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Hais', 2715000, 2715155, 16520, 'PKP cargo', 'Wagony kryte budowy specjalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('Habills', 2756001, 2756066, 19900, 'PKP cargo', 'Wagony kryte budowy specjalnej', 1);
insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu, f_id)
values ('MEGC', 1035304, 1036560, 19900, 'Lotos', 'Cysterna', 2);

