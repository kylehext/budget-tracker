import os
import secrets
from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Secret key for session signing
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')


# Configure session
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///instance/database.db")

@app.route('/')
def index():
    if session.get('user_id'):
        return redirect('/dashboard')
    return render_template('index.html')

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    # Ensure user is logged in
    if 'user_id' not in session:
        return redirect('/login')
    
    if request.method == 'POST':
        goal_type = request.form.get('goal_type')
        title = request.form.get('title')
        description = request.form.get('description')
        target_amount = request.form.get('target_amount')
        current_amount = request.form.get('current_amount', 0)
        
        # Insert new goal into database
        db.execute("INSERT INTO goals (user_id, goal_type, title, description, target_amount, current_amount) VALUES (?, ?, ?, ?, ?, ?)",
                   session["user_id"], goal_type, title, description, target_amount, current_amount)
        
        flash('Goal added successfully!')
        return redirect('/dashboard')
    
    # GET request - show dashboard
    user = db.execute("SELECT username FROM users WHERE id = ?", session["user_id"])
    goals = db.execute("SELECT * FROM goals WHERE user_id = ?", session["user_id"])
    return render_template('dashboard.html', username=user[0]["username"], goals=goals)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Validation
        if not username or not password:
            flash('Username and password required', 'danger')
            return redirect('/register')
        
        # Hash password
        hashed = generate_password_hash(password)
        
        try:
            # Insert into database
            db.execute("INSERT INTO users (username, password) VALUES (?, ?)", 
                       username, hashed)
            return redirect('/login')
        except:
            flash('Username already exists', 'danger')
            return redirect('/register')
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Validation
        if not username or not password:
            flash('Username and password required', 'danger')
            return redirect('/login')
        
        # Query database
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)
        
        # Check credentials
        if len(rows) != 1 or not check_password_hash(rows[0]["password"], password):
            flash('Invalid credentials', 'danger')
            return redirect('/login')
        
        # Remember user
        session["user_id"] = rows[0]["id"]
        flash('Successfully logged in!', 'success')
        return redirect('/')
        
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

# Two routes created with help from claude.ai to ensure confirm button updates database and progress bar,
# and the delete button removes the goal from the database and DOM.
@app.route('/update-goal/<int:goal_id>', methods=['POST'])
def update_goal(goal_id):
    """Update the current amount for a goal"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'error': 'Not logged in'}), 401
    
    try:
        data = request.get_json()
        new_amount = data.get('current_amount')
        
        # Verify the goal belongs to the current user
        goal = db.execute("SELECT * FROM goals WHERE id = ? AND user_id = ?", 
                         goal_id, session['user_id'])
        
        if not goal:
            return jsonify({'success': False, 'error': 'Goal not found'}), 404
        
        # Update the current_amount in the database
        db.execute("UPDATE goals SET current_amount = ? WHERE id = ?", 
                  new_amount, goal_id)
        
        return jsonify({'success': True})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/delete-goal/<int:goal_id>', methods=['POST'])
def delete_goal(goal_id):
    """Delete a goal"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'error': 'Not logged in'}), 401
    
    try:
        # Verify the goal belongs to the current user
        goal = db.execute("SELECT * FROM goals WHERE id = ? AND user_id = ?", 
                         goal_id, session['user_id'])
        
        if not goal:
            return jsonify({'success': False, 'error': 'Goal not found'}), 404
        
        # Delete the goal from the database
        db.execute("DELETE FROM goals WHERE id = ?", goal_id)
        
        return jsonify({'success': True})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500