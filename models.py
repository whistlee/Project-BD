from flask_login import UserMixin
from config import cur


class User(UserMixin):
    def __init__(self, id):
        cur.execute("SELECT EXISTS(SELECT 1 FROM uzytkownik where u_id = %s);",
                    (id,))
        user = cur.fetchone()[0]
        if user:
            self.id = id;
            cur.execute("SELECT email_uzytkownika FROM uzytkownik where u_id = %s;", (id,))
            email = cur.fetchone()[0]
            cur.execute("SELECT nazwa_uzytkownika FROM uzytkownik where u_id = %s;", (id,))
            name = cur.fetchone()[0]
            cur.execute("SELECT haslo FROM uzytkownik where u_id = %s;", (id,))
            password = cur.fetchone()[0]
            self.email = email
            self.name = name
            self.password = password
        else:
            self.id = 0
            self.email = ""
            self.name = ""
            self.password = ""
