from flask import render_template
from flask_login import LoginManager, login_required, current_user
from config import app
import config
from auth import auth as auth_blueprint
from models import User

connex_app = config.connex_app

# Czyta swagger.json aby skonfigurowac endpointy
connex_app.add_api("swagger.json")

app.register_blueprint(auth_blueprint)

login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.init_app(app)
login_manager.needs_refresh_message = u"Session timedout, please re-login"
app.secret_key = 'V37xBMCF7wmfjhtuTbURZA'


@login_manager.user_loader
def load_user(user_id):
    return User(int(user_id))


@connex_app.route("/")
def index():
    return render_template('index.html')


@connex_app.route("/profile")
@login_required
def profile():
    print(current_user.name)
    return render_template('profile.html', name=current_user.name)


@connex_app.route("/bocznica")
@login_required
def bocznica():
    return render_template('bocznica.html')


@connex_app.route("/firmy")
@login_required
def firmy():
    return render_template('firmy.html')


@connex_app.route("/tory")
@login_required
def tory():
    return render_template('tory.html')


@connex_app.route("/wagony")
@login_required
def wagony():
    return render_template('wagony.html')

@connex_app.route("/wagony-bazowe")
@login_required
def wagony_bazowe():
    return render_template('wagony_bazowe.html')

@connex_app.route("/podsumowanie")
@login_required
def podsumowanie():
    return render_template('wagony_podsumowanie.html')

@connex_app.route("/home")
def home():
    return render_template('home.html',name=current_user.name)


# If we're running in stand alone mode, run the application
if __name__ == '__main__':
    connex_app.run(host='localhost', port=9064, debug=True)
