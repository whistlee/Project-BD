from datetime import timedelta

from flask import Blueprint, render_template, redirect, url_for, request, flash, session
from config import cur, connection
from flask_login import login_user, logout_user, login_required
from models import User
from config import app
auth = Blueprint('auth', __name__)



@auth.before_request
def make_session_permanent():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=1)

@auth.route('/login')
def login():
    return render_template('login.html')


@auth.route('/login', methods=['POST'])
def login_post():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False
    cur.execute("SELECT EXISTS(SELECT 1 FROM uzytkownik where email_uzytkownika = %s AND haslo = %s);",
                (email, password))
    value = cur.fetchone()[0]
    if not value:
        flash('Bledy login lub haslo')
        return redirect(url_for('auth.login'))
    # login code goes here
    cur.execute("SELECT u_id FROM uzytkownik WHERE email_uzytkownika = %s AND haslo = %s;", (email, password))
    user_id = cur.fetchone()[0]
    user = User(user_id)
    login_user(user, remember=remember)
    return redirect(url_for('home'))


@auth.route('/signup')
def signup():
    return render_template('signup.html')


@auth.route('/signup', methods=['POST'])
def signup_post():
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')
    print(email)
    cur.execute("SELECT EXISTS(SELECT 1 FROM uzytkownik where email_uzytkownika = %s);", (email,))
    value = cur.fetchone()[0]
    if value:
        flash('Email address already exists')
        return redirect(url_for('auth.signup'))

    cur.execute("INSERT INTO uzytkownik (email_uzytkownika,nazwa_uzytkownika,haslo) values (%s,%s,%s);",
                (email, name, password))
    connection.commit()
    return redirect(url_for('profile'))


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))
