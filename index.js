// Import node modules
const inquirer = require('inquirer');
const mySQL = require('mysql2');
require('console.table');

// Connect to database
const db = mySQL.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
        
    },
    // console.log(`Connected to database`)
)

// Call init function to start when node is run
init();

function init() {
    inquirer
        // Determine what the user wants to do within the Employee Manager
        .prompt(
            {
                type: "list",
                message: "Welcome to Employee Manager. What would you like to do?",
                name: "initPrompt",
                choices: [
                    "View All Current Employees", 
                    "Add New Employee", 
                    "Update Current Employee Info", 
                    "View All Current Roles", 
                    "Add New Role", 
                    "View All Current Departments",
                    "Add New Department"],
            }
        )
        .then((input) => {
            if (input.initPrompt === "View All Curent Employees") {
                db.query('SELECT * FROM employees', function (err, results) {
                    console.table(results);
                  });
            } else if (input.initPrompt === "Add New Employee") {
                
            } else if (input.initPrompt === "Update Current Employee Info") {
                
            } else if (input.initPrompt === "View All Current Roles") {
                db.query('SELECT * FROM roles', function (err, results) {
                    console.table(results);
                  });
            } else if (input.initPrompt === "Add New Role") {
                
            } else if (input.initPrompt === "View All Current Departments") {
                db.query('SELECT * FROM departments', function (err, results) {
                    console.table(results);
                  });
            } else {
                
            }
        })
}