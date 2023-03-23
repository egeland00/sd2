// Import necessary modules
const express = require("express");
const db = require('./services/db');

// Create express app
const app = express();

// Set view engine and views directory
app.set('view engine', 'pug');
app.set('views', './app/views');

// Set static files location
app.use(express.static("./static"));

app.use(express.urlencoded({ extended: true }));
// Routes
app.get("/", function(req, res) {
  res.render("index");
});

// Get the models
//const { user } = require("./models/user");

// User Profile Page
// User Profile Page
//app.get('/user-profile', async function(req, res) {
  //  try {
    //  const sql = 'SELECT id, CONCAT(firstname, " ", lastname) AS fullname, email, level, points FROM user';
      //const users = await db.query(sql);
      //console.log(users);
      //res.render('user-profile', { title: 'User Profile', user: users[0] });
    //} catch (err) {
      //console.error(err);
      //res.status(500).send('Internal server error');
    //}
  //});
  
  
  app.get('/user-profile/:id', async function(req, res) {
    try {
      const userId = req.params.id;
      const userSql = 'SELECT id, CONCAT(firstname, " ", lastname) AS fullname, email, level, points FROM user WHERE id = ?';
      const users = await db.query(userSql, [userId]);
      const user = users[0];
  
      const totalTasksSql = 'SELECT COUNT(*) AS totalTasks FROM task WHERE user_id = ? AND completed = 0';
      const totalTasks = (await db.query(totalTasksSql, [userId]))[0].totalTasks;
  
      const completedTasksSql = 'SELECT COUNT(*) AS completedTasks FROM task WHERE user_id = ? AND completed = 1';
      const completedTasks = (await db.query(completedTasksSql, [userId]))[0].completedTasks;
  
      const dueTasksSql = 'SELECT id, description, due_date FROM task WHERE user_id = ? AND completed = 0 AND due_date > NOW() ORDER BY due_date';
      const dueTasks = await db.query(dueTasksSql, [userId]);
  
      res.render('user-profile', { title: 'User Profile', user, tasks: { totalTasks, completedTasks, dueTasks } });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });
  
  
  


// Register Page
app.get('/register', function (req, res) {
  res.render('register', { title: 'Register' });
});

app.post('/register', async function(req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;
    const sql = 'INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
    const result = await db.query(sql, [firstname, lastname, email, password]);
    console.log(result);
    res.redirect('/login?success=1');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/login', function(req, res) {
  const success = req.query.success;
  res.render('login', { title: 'Login', success: success });
});  

  
// Login Page
app.get('/login', function(req, res) {
    res.render('login', { title: 'Login' });
  });
  
  app.post('/login', async function(req, res) {
    const { email, password } = req.body;
  
    try {
      // Check the database for the user
      const [rows, fields] = await db.query('SELECT * FROM User WHERE email = ? AND password = ?', [email, password]);
  
      if (rows.length === 1) {
        // If the user exists, set the user session and redirect to the user profile page
        req.session.user = { email };
        return res.redirect('/user-profile');
      } else {
        // If the user does not exist or the password is incorrect, display an error message
        const message = 'Invalid email or password';
        return res.render('login', { title: 'Login', message });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });
  
  app.get('/user-profile/:id/tasks', async function(req, res) {
    try {
      const userId = req.params.id;
      const tasksSql = 'SELECT * FROM Task WHERE user_id = ?';
      const tasks = await db.query(tasksSql, [userId]);
      res.render('task', { title: 'Tasks', tasks: tasks });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });
 
  app.get('/tasks/:id', async function(req, res) {
    try {
      const taskId = req.params.id;
      const taskSql = 'SELECT * FROM Task WHERE id = ?';
      const task = await db.query(taskSql, [taskId]);
  
      if (task.length === 0) {
        // Render a 404 error page if the task doesn't exist
        res.status(404).render('error', { message: 'Task not found' });
      } else {
        res.render('task', { title: 'Task Details', task: task[0] });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });
  
  
  

  
  
  



// Start server
app.listen(3000, function () {
  console.log('Server started on http://localhost:3000');
});
