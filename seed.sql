DROP DATABASE IF EXISTS employees_db;

-- Create the database specify it for use.
CREATE DATABASE employees_db;

USE employees_db;

-- Create the table
CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  title VARCHAR(60) NOT NULL,
  department VARCHAR(60) NOT NULL,
  salary INT NOT NULL,
  manager VARCHAR(60) NULL,
  PRIMARY KEY (id)
);

-- Insert a set of employees.
INSERT INTO employees (first_name, last_name, title, department, salary) VALUES ("Bobby", "Smith", "Manager", "Management", 95000);
INSERT INTO employees (first_name, last_name, title, department, salary, manager) VALUES ("Anna", "Pierce", "Engineer", "Engineering", 75000, "Pete Whebbe");
INSERT INTO employees (first_name, last_name, title, department, salary, manager) VALUES ("Pete", "Whebbe", "Lead Engineer", "Management", 75000, "Bobby Smith");
INSERT INTO employees (first_name, last_name, title, department, salary, manager) VALUES ("Julie", "Quinn", "Engineer","Engineering", 65000, "Pete Whebbe");
INSERT INTO employees (first_name, last_name, title, department, salary, manager) VALUES ("Erik", "Erikson", "Developer", "Software", 75000, "Bobby Smith");
INSERT INTO employees (first_name, last_name, title, department, salary, manager) VALUES ("Benj", "FitzPatrick", "Developer", "Software", 75000, "Bobby Smith");