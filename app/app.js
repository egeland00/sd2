// Import necessary modules
const express = require("express");
const db = require('./services/db');

// Create express app
const app = express();

const DEBUG = true;
// Set view engine and views directory
app.set('view engine', 'pug');
app.set('views', './app/views');

// Set static files location
app.use(express.static("./static"));

app.use(express.urlencoded({ extended: true }));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));


// Get the models
const { User } = require("./models/user");
const { Task } = require("./models/task");
const { Profile } = require("./models/profile");

// Set the sessions
var session = require('express-session');
app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Routes
// Routes
app.get("/", function(req, res) {
  const loggedIn = req.session.uid ? true : false;
  res.render("index", { title: 'Home', loggedIn: loggedIn });
});

//Require login function
function requireLogin(req, res, next) {
  if (req.session.uid) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.get('/user-profile/:id', requireLogin, async function(req, res) {
  try {
    const loggedIn = req.session.uid ? true : false;
    const loggedInUserId = req.session.uid || null;
    const userId = req.params.id;

    const profile = new Profile(userId);
    const user = await profile.getUserProfile();
    const totalTasks = await profile.getTotalTasks();
    const completedTasks = await profile.getCompletedTasks();
    const dueTasks = await profile.getDueTasks();

    res.render('user-profile', { title: 'User Profile', user, tasks: { totalTasks, completedTasks, dueTasks }, loggedIn: loggedIn, loggedInUserId: loggedInUserId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});;
  
  
  
//REGISER DONE MODEL

// Register Page
app.get('/register', function (req, res) {
  const loggedIn = req.session.uid ? true : false;
  const userId = req.session.uid || null;
  res.render('register', { title: 'Register', loggedIn: loggedIn, userId: userId });
});


app.post('/set-password', async function (req, res) {
  const params = req.body;
  const user = new User(params.email);
  try {
    const uId = await user.getIdFromEmail();
    if (uId) {
      // If a valid, existing user is found, set the password and redirect to the users single-student page
      await user.setUserPassword(params.password);
      res.send('COME BACK TO ADDING ROUTE FOR USER TASK PAGE!!!!!!!');
    } else {
      // If no existing user is found, add a new one
      // Pass firstname, lastname, and password when calling addUser()
      const newId = await user.addUser(params.firstname, params.lastname, params.password);
      res.redirect('/login?success=1');
    }
  } catch (err) {
    console.error(`Error while adding password `, err.message);
  }
});


app.get('/login', function(req, res) {
  const loggedIn = req.session.uid ? true : false;
  const userId = req.session.uid || null;
  const success = req.query.success;
  res.render('login', { title: 'Login', success: success, loggedIn: loggedIn, userId: userId });
});
 

  
// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
params = req.body;
var user = new User(params.email);
try {
    uId = await user.getIdFromEmail();
    if (uId) {
        match = await user.authenticate(params.password);
        if (match) {
            req.session.uid = uId;
            req.session.loggedIn = true;
            console.log(req.session);
            res.redirect('/user-profile/' + uId);
        }
        else {
            // TODO improve the user journey here
            res.send('invalid password');
        }
    }
    else {
        res.send('invalid email');
    }
} catch (err) {
    console.error(`Error while comparing `, err.message);
}
});

// Logout
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});
  
// set up a route for rendering a single incomplete task
app.get('/user-profile/:id/tasks', requireLogin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Call the getIncompleteTasks method directly using the Task class
    const tasks = await Task.getIncompleteTasks(userId);

    // Call the getUserById method directly using the User class
    const user = await User.getUserById(userId);

    const loggedIn = req.session.uid ? true : false;
    const loggedInUserId = req.session.uid || null;

    res.render('task', { title: 'Tasks', tasks: tasks, user: { id: userId }, loggedIn: loggedIn, loggedInUserId: loggedInUserId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


// adding task

app.post('/user-profile/:id/tasks', requireLogin, async (req, res) => {
  try {
    const { title, description, category, due_date } = req.body;
    const userId = req.params.id;

    // Call the addTask method using the Task class
    await Task.addTask(userId, title, description, category, due_date);

    res.redirect(`/user-profile/${userId}/tasks`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


app.get('/user-profile/:userId/tasks/:taskId', requireLogin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const taskId = req.params.taskId;

    const taskModel = new Task(userId);
    const task = await taskModel.getTaskById(taskId);

    const loggedIn = req.session.uid ? true : false;
    const loggedInUserId = req.session.uid || null;

    res.render('task', { title: 'Tasks', task: task, user: { id: userId }, loggedIn: loggedIn, loggedInUserId: loggedInUserId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});



// set up a route to delete a task
app.delete('/user-profile/:userId/tasks/:taskId/delete', requireLogin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const taskId = req.params.taskId;

    await Task.deleteTask(taskId);

    res.redirect(`/user-profile/${userId}/tasks`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});




// set up a route to update the completed status of a task
app.post('/user-profile/:userId/tasks/:taskId/completed', requireLogin, async (req, res) => {
  try {
    const userId = req.session.uid;
    const taskId = req.params.taskId;
    const completed = req.body.completed === 'true';

    console.log('userId:', userId, 'taskId:', taskId, 'completed:', completed);

    await Task.updateCompletedStatus(taskId, userId, completed);

    res.redirect(`/user-profile/${userId}/tasks`);
  } catch (err) {
    console.error('Error in updating task completion status:', err);
    if (DEBUG) {
      res.status(500).send(`Internal server error: ${err.message}`);
    } else {
      res.status(500).send('Internal server error');
    }
  }
});



// help server not to crash
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});











// Start server
app.listen(3000, function () {
  console.log('Server started on http://localhost:3000');
});
