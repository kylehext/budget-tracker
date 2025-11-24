import os
from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.config['DEBUG'] = True

# Configure session
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///instance/database.db")

@app.route('/')
def index():
    # Check if user is logged in
    if session.get('user_id'):
        # User is logged in - show their budget/goals
        user = db.execute("SELECT username FROM users WHERE id = ?", session["user_id"])
        #goals = db.execute("SELECT * FROM goals WHERE user_id = ?", session["user_id"])
        return render_template('dashboard.html', username=user[0]["username"])
    else:
        # User is not logged in - show welcome/homepage
        return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Validation
        if not username or not password:
            flash('Username and password required')
            return redirect('/register')
        
        # Hash password
        hashed = generate_password_hash(password)
        
        try:
            # Insert into database
            db.execute("INSERT INTO users (username, password) VALUES (?, ?)", 
                       username, hashed)
            return redirect('/login')
        except:
            flash('Username already exists')
            return redirect('/register')
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Validation
        if not username or not password:
            flash('Username and password required')
            return redirect('/login')
        
        # Query database
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)
        
        # Check credentials
        if len(rows) != 1 or not check_password_hash(rows[0]["password"], password):
            flash('Invalid credentials')
            return redirect('/login')
        
        # Remember user
        session["user_id"] = rows[0]["id"]
        return redirect('/')
        
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')