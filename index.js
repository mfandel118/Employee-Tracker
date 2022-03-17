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
                    "Update Info for a Current Employee", 
                    "View All Roles", 
                    "Add New Role", 
                    "View All Departments",
                    "Add New Department",
                    "Exit"],
            }
        )
        .then((input) => {
            if (input.initPrompt === "View All Current Employees") {
                viewEmps();
            } else if (input.initPrompt === "Add New Employee") {
                
            } else if (input.initPrompt === "Update Info for a Current Employee") {
                
            } else if (input.initPrompt === "View All Roles") {
                viewRoles();
            } else if (input.initPrompt === "Add New Role") {
                
            } else if (input.initPrompt === "View All Departments") {
                viewDepts();
            } else if (input.initPrompt === "Add New Department") {
                
            } else {
                console.clear();
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
                console.clear();
                console.log(`Thank you for using Employee Manager. Goodbye!`);
                process.exit();                
            } else {
                console.clear();
                init();
            }
        })
}

// Function to view table of employee data
function viewEmps() {
    db.query('SELECT emp_id, first_name, last_name, roles.title, departments.dept_name, roles.salary, manager_id FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.dept_id = departments.id ORDER BY emp_id;', (err, data) => {
        console.clear();
        console.table(data);
        quit();
    })
}

// Function to view table of roles
function viewRoles() {
    db.query('SELECT * FROM roles', (err, data) => {
        console.clear();
        console.table(data);
        quit();
    })
}

// Function to view table of departments
function viewDepts() {
    db.query('SELECT * FROM departments', (err, data) => {
        console.clear();
        console.table(data);
        quit();
    })
}