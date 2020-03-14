DROP DATABASE IF EXISTS employees_db;

-- Create the database specify it for use.
CREATE DATABASE employees_db;

USE employees_db;

-- Create the tables
CREATE TABLE departments (
    dep_id INT NOT NULL AUTO_INCREMENT,
    department VARCHAR(60) NOT NULL,
    PRIMARY KEY (dep_id)
);

CREATE TABLE roles (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(60) NOT NULL,
    salary INT NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(dep_id),
    PRIMARY KEY (role_id)
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  manager_id INT NULL,
  role_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  PRIMARY KEY (id)
);

-- Insert a set of departments
INSERT INTO departments (department) VALUES ("Management");  -- PK 1
INSERT INTO departments (department) VALUES ("Engineering");  -- PK 2
INSERT INTO departments (department) VALUES ("Admin");  -- PK 3
INSERT INTO departments (department) VALUES ("Other");  -- PK 4

-- Insert into roles:
INSERT INTO roles (title, salary, department_id) VALUES ("Manager", 100000, 1);  -- PK 1
INSERT INTO roles (title, salary, department_id) VALUES ("Engineer", 70000, 2);  -- PK 2
INSERT INTO roles (title, salary, department_id) VALUES ("Software Engineer", 70000, 2);  -- PK 3
INSERT INTO roles (title, salary, department_id) VALUES ("HR Staff", 60000, 3);  -- PK 4
INSERT INTO roles (title, salary, department_id) VALUES ("Lowly Intern", 40000, 4);  -- PK 5

INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Bobby", "Smith", 1, 1);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Pete", "Whebbe", 1, 1);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Anna", "Pierce", 2, 2);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Erik", "Erikson", 2, 2);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Heidi", "Johnson", 1, 4);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("John", "Johnson", 2, 5);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Bob", "Dylan", 2, 3);