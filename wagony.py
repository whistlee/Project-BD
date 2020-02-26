from flask import abort
from config import cur, connection
from flask_login import current_user


def read_all():
    u_id = current_user.id
    wagony = []
    cur.execute(
        """SELECT (json_build_object('nazwa',b.nazwa,'numer',t.numer,'numer_wagonu',wt.numer_wagonu,'dlugosc',w.dlugosc,'czas_wjazdu',wt.czas_wjazdu,
        'czas_wyjazdu',wt.czas_wyjazdu,'czas_na_torze',wt.czas_na_torze,'opuscil_tor',wt.opuscil_tor)) FROM wagony_na_torze wt, tory t,bocznica b,wagony w WHERE
        wt.t_id=t.t_id AND wt.w_id = w.w_id AND t.b_id = b.b_id AND wt.opuscil_tor=FALSE AND u_id = %s;""", (u_id,))
    results = cur.fetchone()
    for row in results:
        wagony.append(row)
    return results


def read_one(numer_wagonu):
    """
    This function responds to a request for /api/scores/{id}
    :return:
    """
    wagony = []
    cur.execute("SELECT sprawdz_czy_istnieje(%s)", (numer_wagonu,))
    value = cur.fetchone()[0]
    if value:
        cur.execute("SELECT array_to_json((row_to_json(w))) FROM wagony_na_torze w WHERE numer_wagonu = %s;",
                    (numer_wagonu,))
        results = cur.fetchone()
        for row in results:
            wagony.append(row)
        return results
    else:
        abort(404, "Wagon o tym numerze nie znaleziony")

def create(wagon):
    nazwa = wagon.get("nazwa")
    numer = wagon.get("numer")
    numer_wagonu = wagon.get("numer_wagonu")
    u_id = current_user.id

    cur.execute(
        "SELECT t.t_id FROM tory t LEFT JOIN bocznica b ON t.b_id = b.b_id WHERE t.numer = %s AND b.nazwa=%s AND b.u_id = %s;",
        (numer, nazwa, u_id))
    t_id = cur.fetchone()[0]
    cur.execute("SELECT sprawdz_czy_istnieje(%s)", (numer_wagonu,))
    value = cur.fetchone()[0]
    if not value:
        cur.execute("SELECT nowy_wagon(%s,%s)", (t_id, numer_wagonu))
        connection.commit()
        return "Dodano pomyslnie", 201
    else:
        abort(406, "Wagon z tym numerem juz istnieje")


def opusc_tor(numer_wagonu):
    """
    Funkcja ustawia czas wyjazdu, czas pobytu i wartosc true dla
    pola opuscil_tor
    :param numer_wagonu:
    :return:
    """
    cur.execute("SELECT opusc_bocznice(%s)", (numer_wagonu,))
    value = cur.fetchone()[0]
    connection.commit()
    if value:
        return "Wagon opuscil bocznice", 201
    else:
        abort(404, "Wagon o tym numerze nie znaleziony")


def update(numer_wagonu, wagon):
    abort(404, "Score in this day not found")


def delete(numer_wagonu):
    """
    :param date:
    :return:
    """
    cur.execute("SELECT EXISTS(SELECT 1 from wagony_na_torze where numer_wagonu = %s;", (numer_wagonu,))
    val = cur.fetchone()[0]
    if val:
        cur.execute("DELETE FROM wagony_na_torze WHERE numer_wagonu = %s;", (numer_wagonu))
        connection.commit()
        return "Deleted successfully", 201
    else:
        abort(404, "Bocznica o tej nazwie nie znaleziona")


