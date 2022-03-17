-- Insert values for created SQL tables --
INSERT INTO departments (dept_name)
VALUES ("Management"),
       ("Sales"),
       ("Engineering"),
       ("Human Resources"),
       ("Accounting");

INSERT INTO roles (title, salary, dept_id)
VALUES ("Manager", 120000, 1),
       ("Sales Representative", 75000, 2),
       ("Sales Assistant", 40000, 2),
       ("Front-End Developer", 80000, 3),
       ("Back-End Developer", 80000, 3),
       ("SCRUM Master", 100000, 3),
       ("HR Representative", 60000, 4),
       ("Staff Accountant", 70000, 5);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Marissa", "Fandel", 1, NULL),
       ("Brianna", "Wilber", 1, NULL),
       ("Devin", "Booker", 3, 1),
       ("Christopher", "Paul", 8, 2),
       ("Deandre", "Ayton", 5, 1),
       ("Jae", "Crowder", 7, 2),
       ("Cameron", "Payne", 4, 1),
       ("Mikal", "Bridges", 2, 2),
       ("Frank", "Kamisky", 6, 1);

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;