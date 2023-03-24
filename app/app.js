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

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});