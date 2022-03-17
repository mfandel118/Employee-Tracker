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
    console.log(`Welcome to Employee Manager`)
)

// Call init function to start when node is run
init();

function init() {
    inquirer
        // Determine what the user wants to do within the Employee Manager
        .prompt(
            {
                type: "list",
                message: "What would you like to do?",
                name: "initPrompt",
                choices: [
                    "View All Current Employees", 
                    "Add New Employee", 
                    "Update Current Employee Info", 
                    "View All Current Roles", 
                    "Add New Role", 
                    "View All Current Departments",
                    "Add New Department",],
            }
        )
        .then((input) => {
            if (input.initPrompt === "View All Current Employees") {
                viewEmps();
            } else if (input.initPrompt === "Add New Employee") {
                
            } else if (input.initPrompt === "Update Current Employee Info") {
                
            } else if (input.initPrompt === "View All Current Roles") {
                db.query('SELECT * FROM roles', function (err, data) {
                    console.table(data);
                  });
            } else if (input.initPrompt === "Add New Role") {
                
            } else if (input.initPrompt === "View All Current Departments") {
                db.query('SELECT * FROM departments', function (err, data) {
                    console.table(data);
                  });
            } else if (input.initPrompt === "Add New Department") {
                
            } else {
                console.log(`Thank you for using Employee Manager. Goodbye!`);
                process.exit();
            }
        })
}

// Function to see if user wants to continue or exit application after each user action
function quit() {
    inquirer
        .prompt(
            {
                type: "confirm",
                message: "Would you like to exit the Employee Manager?",
                default: false,
                name: "quitPrompt"
            }
        )
        .then((input) => {
            if (input.quitPrompt === true) {
                console.log(`Thank you for using Employee Manager. Goodbye!`);
                process.exit();                
            } else {
                init();
            }
        })
}

// Function to view employee data
function viewEmps() {
    db.query('SELECT * FROM employees', (err, data) => {
        console.table(data);
        quit();
      })
}