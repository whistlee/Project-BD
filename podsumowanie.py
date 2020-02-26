from config import cur
from flask_login import current_user
def read_all():
    """
    Funkcja odpowiada na request api/podsumowanie i zwraca liste
    firm ktore korzystaly z bocznicy uzytkownika czas ich wszystkich wagonow na torach
    oraz kwote jaka musza zaplacic
    :return:        podsumowanie json list
    """
    # Create the list of scores from our data
    u_id = current_user.id
    cur.execute("SELECT podsumowanie_torow(%s,%s);", (u_id,4))
    results = cur.fetchone()
    return results
