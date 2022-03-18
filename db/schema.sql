-- Create db --
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

-- Create tables & keys --
CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    dept_id INT,
    -- departments.id = roles.dept_id --
    FOREIGN KEY (dept_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    -- roles.id = employees.role_id --
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE SET NULL
);