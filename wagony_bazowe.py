from flask import  abort
from config import cur, connection



def read_all():
    cur.execute(
        """SELECT *FROM wyswietl_wagony_bazowe;""")
    results = cur.fetchone()
    return results


def read_one(nazwa):
    wagony = []
    cur.execute("SELECT sprawdz_czy_istnieje(%s)", (nazwa,))
    value = cur.fetchone()[0]
    if value:
        cur.execute("SELECT array_to_json((row_to_json(w))) FROM wagony_na_torze w WHERE numer_wagonu = %s;",
                    (nazwa,))
        results = cur.fetchone()
        for row in results:
            wagony.append(row)
        return results
    else:
        abort(404, "Wagon o tej nazwie nie znaleziony")


def create(wagon_bazowy):
    nazwa = wagon_bazowy.get("nazwa")
    nr_startowy = wagon_bazowy.get("nr_startowy")
    nr_koncowy = wagon_bazowy.get("nr_koncowy")
    dlugosc = wagon_bazowy.get("dlugosc")
    wlasciciel = wagon_bazowy.get("wlasciciel")
    typ_wagonu = wagon_bazowy.get("typ_wagonu")

    cur.execute(
        "SELECT EXISTS(SELECT 1 FROM wagony WHERE nazwa = %s);",(nazwa,))
    value = cur.fetchone()[0]
    if not value:
        cur.execute(
            "insert into wagony (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu) values (%s,%s,%s,%s,%s,%s);",
            (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu))
        connection.commit()
        return "Dodano pomyslnie", 201
    else:
        abort(406, "Wagon z tym numerem juz istnieje")


def update(nazwa, wagon_bazowy):
    cur.execute(
        "SELECT EXISTS(SELECT 1 FROM wagony WHERE nazwa = %s);", (nazwa,))
    value = cur.fetchone()[0]
    if value:
        nazwa_wagonu = wagon_bazowy.get("nazwa")
        cur.execute("UPDATE wagony SET nazwa = %S WHERE nazwa = %s)", (nazwa, nazwa_wagonu))
    else:
        abort(406, "Wagon o tej nazwie nie istnieje")

def delete(nazwa):
    cur.execute("SELECT EXISTS(SELECT 1 from wagony where nazwa = %s);", (nazwa,))
    val = cur.fetchone()[0]
    if val:
        cur.execute("DELETE FROM wagony WHERE nazwa = %s CASCADE;", (nazwa,))
        connection.commit()
        return "Deleted successfully", 201
    else:
        abort(404, "Wagon o tej nazwie nie znaleziona")
