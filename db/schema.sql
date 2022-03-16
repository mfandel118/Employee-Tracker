-- Create db --
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

-- Create tables & keys --
CREATE TABLE departments (
    id INT PRIMARY KEY,
    dept_name VARCHAR(30)
);

CREATE TABLE roles (
    id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    dept_id INT,
    -- departments.id = roles.dept_id --
    FOREIGN KEY (dept_id)
    REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    -- roles.is = employees.role_id --
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
);