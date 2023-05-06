const db = require('./../services/db');

class Task {
  static async getIncompleteTasks(userId) {
    const sql = 'SELECT * FROM Task WHERE user_id = ? AND completed = 0';
    const tasks = await db.query(sql, [userId]);
    return tasks;
  }
  //Delete a task
  static async deleteTask(taskId) {
    const deleteTaskSql = 'DELETE FROM Task WHERE id = ?';
    await db.query(deleteTaskSql, [taskId]);
  }

  async getTaskById(taskId) {
    if (!taskId || !this.userId) {
      console.error('taskId or userId is undefined:', taskId, this.userId);
      return null;
    }
  
    const sql = 'SELECT * FROM Task WHERE id = ? AND user_id = ?';
    const task = await db.query(sql, [taskId, this.userId]);
    if (task.length > 0) {
      return task[0];
    } else {
      return null;
    }
  }

  async getTask(taskId, userId) {
    const sql = 'SELECT * FROM Task WHERE id = ? AND user_id = ?';
    const task = await db.query(sql, [taskId, userId]);
    if (task.length > 0) {
      return task[0];
    } else {
      return null;
    }
  }

  static async updateCompletedStatus(taskId, userId, completed) {
    try {
      console.log('taskId:', taskId, 'userId:', userId, 'completed:', completed);
      const completedValue = completed ? 1 : 0;
  
      const updateTaskSql = 'UPDATE Task SET completed = ? WHERE id = ? AND user_id = ? and completed = 0';
  
      if (completedValue === undefined || taskId === undefined || userId === undefined) {
        throw new Error('Missing values in updateCompletedStatus');
      }
  
      const results = await db.query(updateTaskSql, [completedValue, taskId, userId]);
  
      if (completed && results.affectedRows === 1) {
        const updateUserPointsSql = 'UPDATE User SET points = points + 1 WHERE id = ?';
        await db.query(updateUserPointsSql, [userId]);
      }
    } catch (error) {
      console.error('Error in updateCompletedStatus:', error);
      throw error;
    }
  }
  
  
  
  
  

  
  

  
  
  
  



  //Add a new task
  static async addTask(userId, title, description, category, due_date, completed = false) {
    const newTaskSql = 'INSERT INTO Task (user_id, title, description, category, due_date, completed) VALUES (?, ?, ?, ?, ?, ?)';
    await db.query(newTaskSql, [userId, title, description, category, due_date, completed]);
  }
  
}

module.exports = {
  Task,
};
