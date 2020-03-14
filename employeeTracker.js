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
            choices: ['View All Employees', 'Add Employee', 'Remove Employee', 'Update Employee', 'View employees by Department'],
            message: 'Choose an option:',
            name: "option"
        }
    ])
    .then(function(input) {
        if(input.option === "View All Employees") {
            connection.query("SELECT * FROM employees", function(err, res) {
                if(err) throw err;
                console.table(res);
                askUser();
            });
        }
        if(input.option === "View employees by Department") {
            inquirer.prompt([
                {
                    type: 'list',
                    choices: ['Management', 'Engineering', 'Software'],
                    message: 'Choose a department:',
                    name: "department"
                }
            ])
            .then(function(departmentInput) {
                connection.query("SELECT * FROM employees WHERE department = ?", departmentInput.department, function(err, res) {
                    if(err) throw err;
                    console.table(res);
                    askUser();
                });
            });
        }
        if(input.option === "Add Employee") {
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
                    type: 'input',
                    message: "Employee title",
                    name: "title"
                },
                {
                    type: 'input',
                    message: "Employee department",
                    name: "department"
                },
                {
                    type: 'input',
                    message: "Employee salary",
                    name: "salary"
                },
                {
                    type: 'input',
                    message: "Employee manager",
                    name: "manager"
                }
            ]).then(function(employeeInfo) {
                employeeData = [employeeInfo.firstName, employeeInfo.lastName, employeeInfo.title, employeeInfo.department, employeeInfo.salary, employeeInfo.manager];
                
                connection.query("INSERT INTO employees (first_name, last_name, title, department, salary, manager) VALUES (?, ?, ?, ?, ?, ?)", employeeData, function(err, res) {
                    if(err) throw err;
                    askUser();
                });
            });
        }
        if(input.option === "Remove Employee") {
            //Get names and ids from database and pass into inquirer prompt
            connection.query("SELECT id, first_name, last_name from employees", function(err, data) {
                if(err) throw err;

                names = [];
                for(let i = 0; i < data.length; i++) {
                    names.push(data[i].id + " " + data[i].first_name + " " + data[i].last_name);
                };

                inquirer.prompt([
                    {
                        type: 'list',
                        choices: names,
                        message: 'Choose an employee to remove:',
                        name: "axedEmployee"
                    }
                ]).then(function(choice) {
                    //Get ID of removed employee selection and remove from database
                    const axedEmployeeID = choice.axedEmployee.split(" ")[0];
                    connection.query("DELETE FROM employees WHERE id = ?", axedEmployeeID, function(err, data) {
                        if(err) throw err;
                        askUser();
                    });
                });
            })
        }
    });
};

askUser();