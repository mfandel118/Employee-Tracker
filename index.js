// Import node modules
const inquirer = require('inquirer');
const mySQL = require('mysql2');
require('console.table');
const figlet = require('figlet');

// Declare variables for empty arrays needed
const roleArr = [];
const deptArr = [];
const mgrArr = [];
const empArr = [];

// Connect to database
const db = mySQL.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
    // console.log(`Welcome to Employee Manager`)
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

// Figlet function for ASCII art titles
function renderFiglet(title) {
    console.clear();
    console.log(figlet.textSync(title, {
        font: 'doom',
    }))
}

function init() {
    renderFiglet(`Employee\nRecords`);
    
    // Determine what the user wants to do within the Employee Manager
    inquirer
        .prompt(
            {
                type: "list",
                message: "What would you like to do?",
                name: "initPrompt",
                choices: [
                    "View All Current Employees", 
                    "Update Info for a Current Employee", 
                    "View All Roles", 
                    "View All Departments",
                    "Add New Record",
                    "Delete an Existing Record",
                    "Exit"
                ],
            }
        )
        .then((input) => {
            if (input.initPrompt === "View All Current Employees") {
                viewEmps();
            } else if (input.initPrompt === "Update Info for a Current Employee") {
                updateEmp();
            } else if (input.initPrompt === "View All Roles") {
                viewRoles();
            } else if (input.initPrompt === "View All Departments") {
                viewDepts();
            } else if (input.initPrompt === "Add New Record") {
                addRecord();
            } else if (input.initPrompt === "Delete an Existing Record") {
                deleteRecord();
            } else {
                renderFiglet(`Goodbye!`);
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
                message: "Would you like to exit the Employee Records Database?",
                default: false,
                name: "quitPrompt"
            }
        )
        .then((input) => {
            if (input.quitPrompt === true) {
                renderFiglet(`Goodbye!`);
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
        renderFiglet(`Employees:`);
        console.table(data);
        quit();
    })
}

// Function to view table of roles
function viewRoles() {
    db.query('SELECT roles.id, title, salary, dept_id, departments.dept_name FROM roles JOIN departments ON roles.dept_id = departments.id ORDER BY id', (err, data) => {
        renderFiglet(`Roles:`);
        console.table(data);
        quit();
    })
}

// Function to view table of departments
function viewDepts() {
    db.query('SELECT * FROM departments ORDER BY id', (err, data) => {
        renderFiglet(`Departments:`);
        console.table(data);
        quit();
    })
}

// Function to determine what type of record is being added
function addRecord() {
    renderFiglet(`Add  New\nRecord:`);

    inquirer
        .prompt(
            {
                type: "list",
                message: "What type of record would you like to add to the database?",
                choices: ['Add New Employee', 'Add New Role', 'Add New Department'],
                name: "newRecord"
            }
        )
        .then((input) => {
            if (input.newRecord === 'Add New Employee') {
                addEmp();
            } else if (input.newRecord === 'Add New Role') {
                addRole();
            } else {
                addDept();
            }
        })
}

// Function to add new employee
function addEmp() {
    renderFiglet(`Add   New\nEmployee:`);

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
    renderFiglet(`Add  New  Role:`);

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
    renderFiglet(`Add    New\nDepartment:`);

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
    renderFiglet(`Update\nEmployee:`);

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
                choices: ["Update role of an employee", "Assign new Manager for an employee"],
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
                message: `What is their new role?`,
                choices: roleArr,
                when: (input) => input.newInfo === "Update role of an employee",
                name: "newRole"
            },
            {
                type: "list",
                message: `Who is their new Manager?`,
                choices: mgrArr,
                when: (input) => input.newInfo === "Assign new Manager for an employee",
                name: "newMgr"
            },
        ])
        .then((input) => {
            if (input.newInfo === "Update role of an employee") {
                db.query('UPDATE employees SET role_id = ? WHERE id = ?', [input.newRole, input.empChoice], (err, data) => {
                    console.clear();
                    console.log(`Employee records updated!`);
                    quit();
                })
                // console.log(input.newRole)
            } else {
                db.query('UPDATE employees SET manager_id = ? WHERE id = ?', [input.newMgr, input.empChoice], (err, data) => {
                    console.clear();
                    console.log(`Employee records updated!`);
                    quit();
                })
            }
        }) 
   
}

// Function to delete a role, dept, or employee
function deleteRecord() {
    renderFiglet(`Delete  a\nRecord:`);
    getEmps();
    getRoles();
    getDepts();
    inquirer
        .prompt([
            {
                type: "list",
                message: "What type of record would you like to delete from the database?",
                choices: ['Delete an Employee', 'Delete a Role', 'Delete a Department'],
                name: "delRecord"
            },
            {
                type: "list",
                message: "Which employee would you like to delete?",
                choices: empArr,
                when: (input) => input.delRecord === 'Delete an Employee',
                name: "delEmp"
            },
            {
                type: "confirm",
                message: "Are you sure you want to permanently delete this employee from the database?",
                default: false,
                when: (input) => input.delRecord === 'Delete an Employee',
                name: "delEmpConfirm"
            },
            {
                type: "list",
                message: "Which role would you like to delete?",
                choices: roleArr,
                when: (input) => input.delRecord === 'Delete a Role',
                name: "delRole"
            },
            {
                type: "confirm",
                message: "Are you sure you want to permanently delete this role (and all employees with this role) from the database?",
                default: false,
                when: (input) => input.delRecord === 'Delete a Role',
                name: "delRoleConfirm"
            },
            {
                type: "list",
                message: "Which department would you like to delete?",
                choices: deptArr,
                when: (input) => input.delRecord === 'Delete a Department',
                name: "delDept"
            },
            {
                type: "confirm",
                message: "Are you sure you want to permanently delete this department (and all roles & employees in this department) from the database?",
                default: false,
                when: (input) => input.delRecord === 'Delete a Department',
                name: "delDeptConfirm"
            },
        ])
        .then((input) => {
            if (input.delEmpConfirm === true) {
                db.query('DELETE FROM employees WHERE id = ?', input.delEmp, (err, data) => {
                    console.clear();
                    console.log(`Employee deleted!`);
                    quit();
                })
            } else if (input.delEmpConfirm === false) {
                console.log(`No Records Deleted.`);
                quit();
            } else if (input.delRoleConfirm === true) {
                db.query('DELETE FROM roles WHERE id = ?', input.delRole, (err, data) => {
                    console.clear();
                    console.log(`Role deleted!`);
                    quit();
                })
            } else if (input.delRoleConfirm === false) {
                console.log(`No Records Deleted.`);
                quit();
            } else if (input.delDeptConfirm === true) {
                db.query('DELETE FROM departments WHERE id = ?', input.delDept, (err, data) => {
                    console.clear();
                    console.log(`Department deleted!`);
                    quit();
                })
            } else {
                console.log(`No Records Deleted.`);
                quit();
            }
        })
}

// Call init function to start application when node is run
init();