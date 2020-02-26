from flask import abort
from config import cur, connection
from flask_login import current_user


def read_all():
    """
    Funkcja odpowiada na request /api/bocznica
    i zwraca liste bocznic dla danego uzytkownika
    :return:        json list bocznica
    """
    # Create the list of scores from our data
    u_id = current_user.id
    print(u_id)
    bocznica = []
    cur.execute("SELECT (json_build_object('nazwa',b.nazwa)) FROM bocznica b WHERE u_id=%s;", (u_id,))
    results = cur.fetchone()
    print(results)
    if (results[0] == None):
        abort(404, "Nie masz aktualnie zadnych bocznic, dodaj je")
    for row in results:
        bocznica.append(row)
    return results


def read_one(nazwa):
    """
    Ta funkcja odpoiwada na request /api/bocznica/{id}
    :return:
    """

    bocznica = []
    u_id = current_user.id
    cur.execute("SELECT EXISTS(SELECT 1 from bocznica where nazwa = %s AND u_id = %s);", (nazwa, u_id))
    value = cur.fetchone()[0]
    if value:
        cur.execute("SELECT (json_build_object('nazwa',b.nazwa)) FROM bocznica b WHERE nazwa = %s AND u_id=%s;",
                    (nazwa, u_id))
        results = cur.fetchone()
        for row in results:
            bocznica.append(row)
        return results
    else:
        abort(404, "Bocznica o tej nazwie nie znaleziona")


def create(bocznica):
    """
    Funkcja tworzy nowa bocznice na podstawie przekazanych danych
    :param bocznica:
    :return:
    """
    nazwa = bocznica.get("nazwa")
    u_id = current_user.id
    print(nazwa)
    cur.execute("SELECT EXISTS(SELECT 1 from bocznica where nazwa = %s AND u_id=%s);", (nazwa, u_id))
    value = cur.fetchone()[0]
    print(value)
    if not value:
        cur.execute("INSERT INTO bocznica (u_id,nazwa) VALUES (%s,%s);", (u_id, nazwa,))
        connection.commit()
        return "Pomyslnie dodano", 201
    else:
        abort(406, "Bocznica o tej nazwie już istnieje")


def update(nazwa, bocznica):
    """
    Funckja aktualizuje bocznice
    :param nazwa:
    :param bocznica:
    :return:
    """
    abort(404, "Bocznica o tej nazwie nie znaleziona")


def delete(nazwa):
    """
    Funkcja usuwa bocznice o zadanej nazwie
    :param date:
    :return:
    """
    u_id = current_user.id
    cur.execute("SELECT EXISTS(SELECT 1 from bocznica where nazwa = %s AND u_id = %s);", (nazwa, u_id))
    val = cur.fetchone()[0]
    if val:
        cur.execute("DELETE FROM bocznica WHERE nazwa = %s AND u_id= %s;", (nazwa, u_id))
        connection.commit()
        return "Usunieto pomyslnie", 201
    else:
        abort(404, "Bocznica o tej nazwie nie znaleziona")
