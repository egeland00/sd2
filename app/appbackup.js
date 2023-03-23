// Import express.js
const express = require("express");

// Create express app
var app = express();

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Add static files location
app.use(express.static("./static"));
app.use(flash());

// Get the functions in the db.js file to use
const db = require('./services/db');


// Create a route for root
app.get("/", function(req, res) {
    res.render("index");
});

app.get('/layout/')


app.get('/user-profile', async function(req, res) {
  // Check if the user session is set
if (!req.session.user) {
 return res.redirect('/login');
}

const email = req.session.user.email;

try {
  // Check the database for the user
 const [rows, fields] = await db.query('SELECT CONCAT(firstname, " ", lastname) AS fullname, email, level, points FROM User WHERE email = ?', [email]);

 if (rows.length === 1) {
    // If the user exists, render the user profile page with the user data
   const user = rows[0];
   return res.render('user-profile', { title: 'User Profile', user });
 } else {
   // If the user does not exist, display an error message
   const message = 'User not found';
   return res.render('user-profile', { title: 'User Profile', message });
 }
} catch (err) {
 console.error(err);
 res.status(500).send('Internal server error');
}
});

  

app.post('/register', async function(req, res) {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Insert the new user into the database
    const [result, fields] = await db.query('INSERT INTO User (firstname, lastname, email, password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, password]);

    // If the user was successfully registered, redirect to the user profile page
    req.session.user = { email };
    return res.redirect('/user-profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

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




// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});

