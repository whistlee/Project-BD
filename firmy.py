from flask import abort
from config import cur, connection
from flask_login import current_user


def read_all():
    """
    Funkcja odpowiada na request api/firmy i zwraca liste firm
    :return:        list firm w json
    """
    # Create the list of scores from our data
    tory = []
    cur.execute(
        "SELECT * FROM wyswietl_firmy;")
    results = cur.fetchone()
    for row in results:
        tory.append(row)
    return results


def read_one(NIP):
    """
    Funckja odpowiada na request /api/firmy/{NIP} i zwraca pojedynczy rekord
    :return:
    """
    tory = []
    cur.execute("SELECT EXISTS(SELECT 1 from firmy where NIP = %s);", (NIP,))
    value = cur.fetchone()[0]
    if value:
        cur.execute("SELECT wyswietl_firme(%s);", (NIP,))
        results = cur.fetchone()
        for row in results:
            tory.append(row)
        return results
    else:
        abort(404, "Score in this day not found")


def create(firmy):
    """
    Funkcja tworzy nowa firme na podstawie przekazanych danych
    :param firmy:
    :return:
    """
    nazwa = firmy.get("nazwa")
    telefon = firmy.get("telefon")
    NIP = firmy.get("NIP")
    email = firmy.get("email")
    adres = firmy.get("adres")
    miasto = firmy.get("miasto")
    kraj = firmy.get("kraj")
    kod_pocztowy = firmy.get("kod_pocztowy")
    print(nazwa, telefon, NIP, adres, miasto)
    cur.execute("SELECT EXISTS(SELECT 1 from adres where adres = %s AND miasto = %s AND kraj= %s);",
                (adres, miasto, kraj))
    value = cur.fetchone()[0]
    cur.execute("SELECT EXISTS(SELECT 1 from firmy where NIP = %s);", (NIP,))
    value1 = cur.fetchone()[0]
    if not value1:
        if not value:
            cur.execute("INSERT INTO adres(adres,miasto,kraj,kod_pocztowy) VALUES (%s,%s,%s,%s);",
                        (adres, miasto, kraj, kod_pocztowy))
        cur.execute("SELECT adres_id from adres  where adres = %s AND miasto = %s AND kraj= %s", (adres, miasto, kraj))
        adres_id = cur.fetchone()[0]
        cur.execute("INSERT INTO firmy(adres_id, nazwa, telefon, NIP, email) VALUES (%s,%s,%s,%s,%s);",
                    (adres_id, nazwa, telefon, NIP, email))
        connection.commit()
        return "Dodano pomyslnie", 201
    else:
        abort(406, "Firma o tej nazwie już istnieje")


def update(NIP, firma):
    """
    Funkcja aktualizuje firme o podanym NIPie
    :param NIP:
    :param firma:
    :return:
    """
    abort(404, "Firma o tej nazwie nie istnieje")


def delete(NIP):
    """
    Funckja usuwa firme o podanym NIPie
    :param NIP:
    :return:
    """
    cur.execute("SELECT EXISTS(SELECT 1 from firmy where NIP = %s);", (NIP,))
    print(NIP)
    value = cur.fetchone()[0]
    if value:
        cur.execute("DELETE FROM firmy WHERE NIP=%s;", (NIP,))
        connection.commit()
        return "Usunieto pomyslnie", 201
    else:
        abort(404, "Firma o tym NIPie nie znaleziona")


def firma_uzytkownika(NIP):
    """
    Funckja aktualizuje f_id podanej firmy do uzytkownika
    :param NIP:
    :return:
    """
    u_id = current_user.id
    cur.execute("SELECT dodaj_firme_uzytkownika(%s,%s)", (NIP, u_id))
    value = cur.fetchone()[0]
    print(value)
    connection.commit()
    if value:
        return "Firma dodana do uzytkownika", 201
    else:
        abort(404, "Firma o tym numerze nie znaleziona")


def firma_wagonow(NIP):
    """
    Funckja aktualizuje f_id podanej firmy dla wszystkich wagonow posiadajacych taka sama nazwe firmy
    :param NIP:
    :return:
    """
    cur.execute("SELECT nazwa FROM firmy WHERE NIP = %s;", (NIP,))
    nazwa_firmy = cur.fetchone()[0]
    print(nazwa_firmy)
    cur.execute("SELECT dodaj_firme_wagonow(%s,%s)", (NIP, nazwa_firmy))
    value = cur.fetchone()[0]
    print(value)
    connection.commit()
    if value:
        return "Firma dodana do wagonu", 201
    else:
        abort(404, "Firma o tym numerze nie znaleziona")
