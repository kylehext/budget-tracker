# Budget and Save Tracker
#### Video Demo:  <URL HERE>
#### Description:
The Budget and Save Tracker is a web-based application that allows you to create and manage your financial goals. By creating a _Budget_ goal you can easily keep track of how much money is left in your budget, with a progress bar to show the percent of your budget that has been used. By creating a _Savings_ goal, you can set a desired amount of money to save and visually see how close you are to reaching your goal.

### Technologies:
- HTML/CSS/JavaScript
- Python (Flask)
- SQLite

### Key Dependencies:
- CS50 Library (for database structure and operations)
- Werkzeug (for password hashing)
- Bootstrap Icons

<br/>

The file structure for my project follows the Flask framework. In the **instance** folder, I have my database created with SQLite which stores the users information when creating an account (username and hashed password) as well as their budget and savings goals. I appreciated the ease of use that CS50's SQL library provided for interacting with the database, making queries straightforward and readable, so I decided to implement that same library in my final project. <br/>

In the **static** folder, I have my JavaScript file, my CSS stylesheet and a favicon file that changes the icon on the browser tab to a piggy bank! In *dashboard.js*, I have all the code that manages the functionality of the modal that pops up when creating a goal and dynamically changing the fields needed depending on the goal, the progress bar functionality, and the individual buttons within each goal card (add/subtract money from goal, confirm value, and delete goal). For the style of my website I wanted it to be clean, simple, and easy to navigate. I wanted everything to be centered on the screen with smooth, rounded borders. Originally I had the site background color set as a one solid color but I felt that was too harsh on the eye and decided to go with a nice gradient instead. I created a simple navigation bar with Bootstrap which has a logo that takes the user back to the homepage, a Register and a Login button. Once you are logged in, I figured there were no other necessary links needed on my navigation bar other than Log Out. I tried to add a minimal amount of routes in my *app.py* file as to not complicate what is meant to be a simple yet helpful tool. At first, I tried to configure everything on the index ( / ) route and have the page dynamically change depending on whether a user was signed in or not. However I found the logic in Python became too complex for my current understanding to have it all on the index route, so I decided to create a dashboard route as well once the user has signed in. 

My **templates** folder has all of the HTML for each route. I used Jinja's templating to easily extend the layout from *layout.html* to all other html files. In *layout.html* I have all the links necessary for my stylesheet, fonts and icons. I also have the navigation bar and the script tags necessary for the JS functionality of my modal which was created with the help of [<ins>*w3schools.net*<ins>](https://www.w3schools.com/). From there, my layout extends to every page starting with *index.html*, which only adds a title and title description onto the page as well as a button that takes you to the register route. In *register.html* I created a form for the user to create an account with a username and password as well as a Register button that takes the user to the Log In page if they have entered valid credentials. In *login.html* there is a simple form for the user to enter their username and password as well as a Log In button which will take the user to their dashboard showing any created goals. In *dashboard.html* I have a greeting message to the logged in user, as well as dynamic HTML depending on if the user has created a goal or not. If the user has created a goal, they will be displayed on the screen 3 in each row with a progress bar indicating how close they are to reaching the goal. If the user has not created any goals, there is a "+" button that opens up a modal prompting the user to select either *Budget Goal* or *Savings Goal*. The form entry options change depending on the goal selected, the inner HTML is changed in *dashboard.js*. Once a goal has been created I wanted the ability to add or subtract money from the goal easily accessible. I added little "+" and "-" buttons as well as a checkmark outlined in green to confirm the amount that you want to input. I also added a trashcan button at the top right of each goal card so the user can delete the goal if they no longer need it displayed. 

The rest of the files contained in my project directory are necessary system files such as those in **__pycache__**, **flask_session**, and **venv** which are all excluded from version control via my .gitignore file. The *requirements.txt* file contains all necessary dependencies needed to run the project.

---

### Final Thoughts
This final project has taught me so much -- the capabilities of a Python web application when paired with JavaScript and Flask, file structure and version control with GitHub, and deployment from start to finish of a project. I am proud of what I have created, and the knowledge gained in this course has motivated me to continue learning and pursue a career in software development!