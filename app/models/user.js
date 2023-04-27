// Get the functions in the db.js file to use
const db = require('./../services/db');
const bcrypt = require("bcryptjs");

class User {
  // Id of the user
  id;

  // Email of the user
  email;

  constructor(email) {
    this.email = email;
  }

  static async getUserById(id) {
    const userSql = 'SELECT * FROM User WHERE id = ?';
    const user = await db.query(userSql, [id]);
    if (user.length > 0) {
      return user[0];
    } else {
      return null;
    }
  }

  // Get an existing user id from an email address, or return false if not found
  async getIdFromEmail() {
    var sql = 'SELECT id FROM user WHERE email = ?';
    const result = await db.query(sql, [this.email]);
    if (result.length > 0) {
      this.id = result[0].id;
      return this.id;
    } else {
      return false;
    }
  }


  // Add a password to an existing user
  async setUserPassword(password) {
    const pw = await bcrypt.hash(password, 10);
    var sql = 'UPDATE user SET password = ? WHERE id = ?';
    const result = await db.query(sql, [pw, this.id]);
    return result.affectedRows > 0;
  }

  // Add a new record to the users table
  async addUser(firstname, lastname, password) {
    const pw = await bcrypt.hash(password, 10);
    var sql = 'INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
    const result = await db.query(sql, [firstname, lastname, this.email, pw]);
    this.id = result.insertId;
    return this.id;
  }

  // Test a submitted password against a stored password
  async authenticate(submitted) {
    const sql = 'SELECT password FROM user WHERE id = ?';
    const result = await db.query(sql, [this.id]);
    if (result.length > 0) {
      const storedPassword = result[0].password;
      // Use bcrypt.compare() to compare the submitted password with the stored password
      const match = await bcrypt.compare(submitted, storedPassword);
      return match;
    } else {
      return false;
    }
  }
}

module.exports = {
  User,
};
