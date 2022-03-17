// Import node modules
const inquirer = require('inquirer');
const mySQL = require('mysql2');
require('console.table');

// Declare variables for empty arrays needed
const roleArr = [];
const mgrArr = [];
const deptArr = [];
const empArr = [];

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

// Query functions
function getRoles() {
    // Query to pull all roles and place in array
    db.query('SELECT * FROM roles', (err, data) => {
        // console.log(data);
        for (let role of data) {
            roleArr.push(
                {
                    name: role.title,
                    value: role.id
                }
            )
        }   
    })
}

function getDepts() {
    // Query to pull all departments and place in array
    db.query('SELECT * FROM departments', (err, data) => {
        // console.log(data);
        for (let dept of data) {
            deptArr.push(
                {
                    name: dept.dept_name,
                    value: dept.id
                }
            )
        }   
    })
}

function getMgrs() {
    // Query to pull all managers and place in array
    db.query('SELECT * FROM employees', (err, data) => {
        for (let emp of data) {
            if (emp.role_id === 1) {
                mgrArr.push(
                    {
                        name: `${emp.first_name} ${emp.last_name}`,
                        value: emp.id
                    }
                )
            }
        }   
    })
}

function getEmps() {
    // Query to pull all employees and place in array
    db.query('SELECT * FROM employees', (err, data) => {
        for (let emp of data) {
            empArr.push(
                {
                    name: `${emp.first_name} ${emp.last_name}`,
                    value: emp.id
                }
            )
        }  
    })  
}

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
                    "Exit"
                ],
            }
        )
        .then((input) => {
            if (input.initPrompt === "View All Current Employees") {
                viewEmps();
            } else if (input.initPrompt === "Add New Employee") {
                addEmp();
            } else if (input.initPrompt === "Update Info for a Current Employee") {
                updateEmp();
            } else if (input.initPrompt === "View All Roles") {
                viewRoles();
            } else if (input.initPrompt === "Add New Role") {
                addRole();
            } else if (input.initPrompt === "View All Departments") {
                viewDepts();
            } else if (input.initPrompt === "Add New Department") {
                addDept();
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
    db.query('SELECT employees.id, first_name, last_name, roles.title, departments.dept_name, roles.salary, manager_id FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.dept_id = departments.id ORDER BY id', (err, data) => {
        console.clear();
        console.table(data);
        quit();
    })
}

// Function to view table of roles
function viewRoles() {
    db.query('SELECT roles.id, title, salary, dept_id, departments.dept_name FROM roles JOIN departments ON roles.dept_id = departments.id ORDER BY id', (err, data) => {
        console.clear();
        console.table(data);
        quit();
    })
}

// Function to view table of departments
function viewDepts() {
    db.query('SELECT * FROM departments ORDER BY id', (err, data) => {
        console.clear();
        console.table(data);
        quit();
    })
}

// Function to add new employee
function addEmp() {
    console.clear();

    // Call function to pull all roles and place in array
    getRoles();

    // Call function to pull all managers and place in array
    getMgrs();

    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the new employee's first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: (input) => `What is ${input.firstName}'s last name?`,
                name: "lastName"
            },
            {
                type: "list",
                message: (input) => `What is ${input.firstName} ${input.lastName}'s role?`,
                choices: roleArr,
                name: "roleId"
            },
            {
                type: "confirm",
                message: (input) => `Does ${input.firstName} ${input.lastName} have a manager?`,
                name: "mgrConfirm"
            },
            {
                type: "list",
                message: (input) => `Who is ${input.firstName} ${input.lastName}'s Manager?`,
                when: (input) => input.mgrConfirm === true,
                choices: mgrArr,
                name: "mgrId"
            },
        ])
        .then((input) => {
            db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [input.firstName, input.lastName, input.roleId, input.mgrId], (err, data) => {
                console.clear();
                console.log(`${input.firstName} ${input.lastName} added as new employee!`);
                quit();
            })
        })
}

// Function to add new role
function addRole() {
    console.clear();

    // Call function to pull all departments and place in array
    getDepts();

    // Get info from user on new role
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the new Role?",
                name: "newRole"
            },
            {
                type: "input",
                message: (input) => `What is the salary for ${input.newRole}?`,
                name: "salary"
            },
            {
                type: "list",
                message: (input) => `What department is ${input.newRole} being added to?`,
                choices: deptArr,
                name: "dept"
            },
        ])
        .then((input) => {
            db.query('INSERT INTO roles (title, salary, dept_id) VALUES (?, ?, ?)', [input.newRole, input.salary, input.dept], (err, data) => {
                console.clear();
                console.log(`${input.newRole} added as new role`);
                quit();
            })
        })
}

// Function to add new department
function addDept() {
    console.clear();

    inquirer
        .prompt(
            {
                type: "input",
                message: "What is the name of the new Department?",
                name: "newDept"
            }
        )
        .then((input) => {
            db.query('INSERT INTO departments (dept_name) VALUES (?)', input.newDept, (err, data) => {
                console.clear();
                console.log(`${input.newDept} added as new department`);
                quit();
            })
        })
}

// Function to update current employee info
function updateEmp() {
    console.clear();

    // Call functions to pull all employees & roles and place in arrays
    getEmps();
    getRoles();
    getMgrs();

    // Prompts to determine who/what is being updated
    inquirer
        .prompt([
            {
                type: "list",
                message: (input) => `What would you like to do?`,
                choices: ["Update role of employee", "Assign new Manager for employee"],
                name: "newInfo"
            },
            {
                type: "list",
                message: "Which employee would you like to update?",
                choices: empArr,
                name: "empChoice"
            },
            {
                type: "list",
                message: (input) => `What is their new role?`,
                choices: roleArr,
                when: (input) => input.newInfo === "Update role of employee",
                name: "newRole"
            },
            {
                type: "list",
                message: (input) => `Who is their new Manager?`,
                choices: mgrArr,
                when: (input) => input.newInfo === "Assign new Manager for employee",
                name: "newMgr"
            },
        ])
        .then((input) => {

        }) 
   
}