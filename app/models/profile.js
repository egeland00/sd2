const db = require('../services/db');

class Profile {
  constructor(userId) {
    this.userId = userId;
  }

  async getUserProfile() {
    const userSql = 'SELECT id, CONCAT(firstname, " ", lastname) AS fullname, email, level, points FROM user WHERE id = ?';
    const users = await db.query(userSql, [this.userId]);
    return users[0];
  }

  async getTotalTasks() {
    const totalTasksSql = 'SELECT COUNT(*) AS totalTasks FROM task WHERE user_id = ? AND completed = 0';
    const totalTasks = (await db.query(totalTasksSql, [this.userId]))[0].totalTasks;
    return totalTasks;
  }

  async getCompletedTasks() {
    const completedTasksSql = 'SELECT COUNT(*) AS completedTasks FROM task WHERE user_id = ? AND completed = 1';
    const completedTasks = (await db.query(completedTasksSql, [this.userId]))[0].completedTasks;
    return completedTasks;
  }

  async getDueTasks() {
    const dueTasksSql = 'SELECT id, description, due_date FROM task WHERE user_id = ? AND completed = 0 AND due_date > NOW() ORDER BY due_date';
    const dueTasks = await db.query(dueTasksSql, [this.userId]);
    return dueTasks;
  }
}

module.exports = { 
    Profile, 
};
