// Get the functions in the db.js file to use
const db = require('./../services/db');

class User {
    // Student ID
    id;
    // Student name
    firstname;
    // Student programme
    points;
    // Student modules
    level = [];

    constructor(id) {
        this.id = id;
    }
    
    async getUserName() {
    }
    
    async getUserPoints()  {
    }
    
    async getStudentLevel() {
    }
}

module.exports = {
    User
}