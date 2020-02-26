from flask import abort
from config import cur, connection
from flask_login import current_user


def read_all():
    """
    Funckja odpowiada na request /api/tory
    i zwraca kompletna liste torow uzytkownika
    :return:        lista torow
    """
    # Create the list of scores from our data
    u_id = current_user.id
    tory = []
    cur.execute(
        "SELECT wyswietl_tory(%s);",(u_id,))
    results = cur.fetchone()
    for row in results:
        print(str(row)[1:-1])
        tory.append(row)
    return results


def read_one(t_id):
    """
    Funckja odpowiada na request /api/tory/{t_id}
    i zwraca jeden tor
    :return:
    """
    tory = []
    cur.execute("SELECT EXISTS(SELECT 1 from tory where t_id = %s);", (t_id,))
    value = cur.fetchone()[0]
    if value:
        cur.execute("SELECT array_to_json(array_agg(row_to_json(t))) FROM tory t WHERE t_id = %s;", (t_id,))
        results = cur.fetchone()
        for row in results:
            tory.append(row)
        return results
    else:
        abort(404, "Tor o tym id nie znaleziony")



def create(tory):
    """
    Funckja tworzy nowy obiekt tory
    :param tory:
    :return:
    """
    nazwa = tory.get("nazwa")
    dlugosc = tory.get("dlugosc")
    numer = tory.get("numer")
    u_id = current_user.id
    print(nazwa, dlugosc, numer)
    cur.execute("SELECT b.b_id FROM bocznica b WHERE b.nazwa = %s AND b.u_id = %s", (nazwa,u_id))
    b_id = cur.fetchone()[0]
    print(b_id)
    cur.execute("SELECT EXISTS(SELECT 1 from tory t, bocznica b where t.numer = %s AND t.b_id = %s);", (numer,b_id))
    value = cur.fetchone()[0]
    print(value)

    if not value:
        cur.execute("INSERT INTO tory (b_id,dlugosc,numer) VALUES (%s,%s,%s);", (b_id, dlugosc, numer))
        connection.commit()
        return "Added successfully", 201
    else:
        abort(406, "Bocznica o tej nazwie już istnieje")


def update(date, score):
    abort(404, "Score in this day not found")


def delete(numer):
    """
    Funkcja usuwa tory o zadanym numerze
    :param date:
    :return:
    """

    abort(404, "Bocznica o tej nazwie nie znaleziona")

def zajetosc_toru(nazwa_bocznicy, numer_toru):
    """
    Funckja zwraca zajetosc podanego toru
    :param nazwa_bocznicy:
    :param numer_toru:
    :return:
    """
    u_id = current_user.id
    cur.execute("SELECT zajetosc_toru(%s,%s,%s);", (nazwa_bocznicy, numer_toru,u_id))
    zajetosc = cur.fetchone()[0]
    return zajetosc
