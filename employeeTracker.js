const inquirer = require("inquirer");
const mysql = require("mysql");


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employees_db"
});
  
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("Connected as id " + connection.threadId);
});

function askUser() {
    inquirer.prompt([
        {
            type: 'list',
            choices: ['View All Employees', 'Add Employee', 'Remove Employee', 'Update Employee', 'View employees by Department', 'View employees by Role'],
            message: 'Choose an option:',
            name: "option"
        }
    ])
    .then(function(input) {
        if(input.option === "View All Employees") {
            connection.query("SELECT id, first_name, last_name, title, salary, department, manager_id FROM \
            employees LEFT JOIN (roles LEFT JOIN departments ON roles.department_id = departments.dep_id) ON employees.role_id = roles.role_id", function(err, res) {
                if(err) throw err;
                console.table(res);
                askUser();
            });
        }
        if(input.option === "View employees by Department") {
            connection.query("SELECT department FROM departments", function(err, departmentsData) {
                if(err) throw err;
                
                let departments = [];
                for(let i = 0; i < departmentsData.length; i++) {
                    departments.push(departmentsData[i].department);
                };

                inquirer.prompt([
                    {
                        type: 'list',
                        choices: departments,
                        message: 'Choose a department:',
                        name: "department"
                    }
                ])
                .then(function(departmentInput) {
                    connection.query("SELECT id, first_name, last_name, title, salary, department, manager_id FROM \
                    employees LEFT JOIN (roles LEFT JOIN departments ON roles.department_id = departments.dep_id) ON employees.role_id = roles.role_id WHERE department = ?", departmentInput.department, function(err, res) {
                        if(err) throw err;
                        console.table(res);
                        askUser();
                    });
                });
            });
        }
        if(input.option === "View employees by Role") {
            connection.query("SELECT * FROM roles", function(err, rolesData) {
                if(err) throw err;
                
                let roles = [];
                for(let i = 0; i < rolesData.length; i++) {
                    roles.push(rolesData[i].title);
                };

                inquirer.prompt([
                    {
                        type: 'list',
                        choices: roles,
                        message: 'Choose a role:',
                        name: "role"
                    }
                ])
                .then(function(roleInput) {
                    connection.query("SELECT id, first_name, last_name, title, salary, department, manager_id FROM \
                    employees LEFT JOIN (roles LEFT JOIN departments ON roles.department_id = departments.dep_id) ON employees.role_id = roles.role_id WHERE title = ?", roleInput.role, function(err, res) {
                        if(err) throw err;
                        console.table(res);
                        askUser();
                    });
                });
            });
        }
        if(input.option === "Add Employee") {
            connection.query("SELECT * FROM employees", function(err, data) {
                let names = [];

                for(let i = 0; i < data.length; i++) {
                    names.push(data[i].manager_id + " " + data[i].first_name + " " + data[i].last_name);
                };

                let roles = [];

                function getRoles() {
                    connection.query("SELECT * FROM roles", function(err, queryData) {
                        for(let i = 0; i < queryData.length; i++) {
                            roles.push(queryData[i].role_id + " " + queryData[i].title);
                        }
                    });
                }

                getRoles();

                inquirer.prompt([
                    {
                        type: 'input',
                        message: "Employee first name",
                        name: "firstName"
                    },
                    {
                        type: 'input',
                        message: "Employee last name",
                        name: "lastName"
                    },
                    {
                        type: 'list',
                        message: "Employee role",
                        choices: roles,
                        name: "role"
                    },
                    {
                        type: 'list',
                        message: "Employee manager",
                        choices: names,
                        name: "manager"
                    }
                ]).then(function(employeeInfo) {
                    const managerID = employeeInfo.manager.split(" ")[0];
                    employeeData = [employeeInfo.firstName, employeeInfo.lastName, managerID, employeeInfo.role.split(" ")[0]];

                    connection.query("INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?)", employeeData, function(err, res) {
                        if(err) throw err;
                        askUser();
                    });
                });
            });
        }
        if(input.option === "Remove Employee" || input.option === "Update Employee") {
            //Get names and ids from database and pass into inquirer prompt
            connection.query("SELECT * from employees", function(err, data) {
                if(err) throw err;

                names = [];
                for(let i = 0; i < data.length; i++) {
                    names.push(data[i].id + " " + data[i].first_name + " " + data[i].last_name);
                };

                inquirer.prompt([
                    {
                        type: 'list',
                        choices: names,
                        message: 'Select an employee:',
                        name: "employee"
                    }
                ]).then(function(choice) {
                    if(input.option === "Remove Employee") {
                        //Get ID of selected employee and remove from database
                        const employeeID = choice.employee.split(" ")[0];
                        connection.query("DELETE FROM employees WHERE id = ?", employeeID, function(err, data) {
                            if(err) throw err;
                            askUser();
                        });
                    }
                    else if(input.option === "Update Employee") {
                        //Get ID of selected employee and update selected part of database
                        const employeeID = choice.employee.split(" ")[0];
                        inquirer.prompt([
                            {
                                type: 'list',
                                choices: ["Title", "Department", "Salary", "Manager"],
                                message: 'What do you want to update?:',
                                name: "update"
                            }
                        ]).then(function(choice) {
                            if(choice.update === "Title"){
                                inquirer.prompt([
                                    {
                                        type: 'input',
                                        message: "Enter a new title:",
                                        name: "newTitle"
                                    }
                                ]).then(function(newTitle) {
                                    connection.query("UPDATE employees SET title = ? WHERE id = ?", [newTitle.newTitle, employeeID], function(err, data) {
                                        if(err) throw err;
                                        askUser();
                                    });
                                });
                            }
                            else if(choice.update === "Department") {
                                inquirer.prompt([
                                    {
                                        type: 'input',
                                        message: "Enter a new department:",
                                        name: "newDepartment"
                                    }
                                ]).then(function(newDepartment) {
                                    connection.query("UPDATE employees SET department = ? WHERE id = ?", [newDepartment.newDepartment, employeeID], function(err, data) {
                                        if(err) throw err;
                                        askUser();
                                    });
                                });
                            }
                            else if(choice.update === "Salary") {
                                inquirer.prompt([
                                    {
                                        type: 'input',
                                        message: "Enter a new salary:",
                                        name: "newSalary"
                                    }
                                ]).then(function(newSalary) {
                                    connection.query("UPDATE employees SET salary = ? WHERE id = ?", [newSalary.newSalary, employeeID], function(err, data) {
                                        if(err) throw err;
                                        askUser();
                                    });
                                });
                            }
                            else if(choice.update === "Manager") {
                                inquirer.prompt([
                                    {
                                        type: 'input',
                                        message: "Enter a new manager:",
                                        name: "newManager"
                                    }
                                ]).then(function(newManager) {
                                    connection.query("UPDATE employees SET manager = ? WHERE id = ?", [newManager.newManager, employeeID], function(err, data) {
                                        if(err) throw err;
                                        askUser();
                                    });
                                });
                            }
                        });
                    }
                });
            });
        }
    });
};

askUser();