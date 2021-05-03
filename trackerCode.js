const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) throw err;
    runSearch();
  });

  const runSearch = () => {
      inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'View all Employees by Department',
                'View all Employees by Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'Add Role',
                'View all Roles',
                'Add Department',
                'View all Departments',
            ],
        })
        .then((answer) => {
            switch(answer.action) {
                case 'View all employees':
                    viewEmployees();
                break;

                case 'View all Employees by Department':
                    viewByDepartment();
                break;

                case 'View all Employees by Manager':
                    viewByManager();
                break;

                case 'Add Employee':
                    addEmployee();
                break;
                
                case 'Remove Employee':
                    removeEmployee();
                break;

                case 'View all Roles':
                    viewRoles();
                break;

                case 'Add Role':
                    addRole();
                break;

                case 'View all Departments':
                    viewDepartments();
                break;
            }
        })
  }

const viewEmployees = () => {
    const query = 'SELECT * FROM employee';
    connection.query(query, (err, res) => {
        console.log(`EMPLOYEES:`)
        console.table(res);
        runSearch();
    });
}

const viewByDepartment = () => {
    const query = 'SELECT department.department_name AS department, employee.first_name, employee.last_name, employee.role_id FROM employee LEFT JOIN employee_role ON employee.role_id=employee_role.id LEFT JOIN department ON department.id=employee_role.department_id'
    connection.query(query, (err, res) => {
        if (err) throw (err);
        console.log(`EMPLOYEES BY DEPARTMENT:`);
        console.table(res);
        runSearch();
    });
}

// const viewByManager = () => {
//     const query = 'SELECT employee.first_name, employee.last_name AS manager, department.department_name AS department, employee.id, employee.role_id FROM employees LEFT JOIN employee'
// }

const addEmployee = () => {
    const query = 'SELECT * FROM employee';
    inquirer
    .prompt({
      name: 'firstName',
      type: 'input',
      message: 'What is the employees first name?',
    },
    {
        name: 'lastName',
        type: 'input',
        message: 'What is the employees last name?',
    },
    {
        name: 'role',
        type: 'rawlist',
        message: 'What is the employees role?',
        choices: [
            'Sales Lead',
            'Salesperson',
            'Lead Engineer',
            'Software Engineer',
            'Account Manager',
            'Accountant',
            'Legal Team Lead',
        ],
    })
    //
    // {connection.query(query, (err, res) => { 
    //     inquirer.prompt({
    //         name: 'employeeManager',
    //         type: 'rawlist',
    //         message: 'Who is the employees manager?',
    //         choices: res.map(employee => employee.manager_id)})
    //     .then((answer) => {
    //         console.log(answer);
    //         connection.query('SELECT * FROM employee WHERE ?',
    //             { id: answer.employee },
    //             (err, res) => {
    //                 console.log(res);
    //                 if (err) throw err;
    //                 console.log('Your employee was deleted successfully!');
    //                 runSearch();
    //             });
    //         });
    // }),
    // })
    .then((answer) => {
        connection.query('INSERT INTO employee SET ?',
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.role,
                manager_id: answer.employeeManager,
            },
            (err) => {
                if (err) throw err;
                console.log('Your employee was created successfully!');
                runSearch();
              }
        )
    })
    };


const removeEmployee = () => {
    const query = 'SELECT * FROM employee';
    connection.query(query, (err,res) => {
        // console.log(res.map(employee => employee.id));
        inquirer
            .prompt({
                name: 'employee',
                type: 'rawlist',
                message: 'Which employee would you like to remove?',
                choices: res.map(employee => employee.id)
        })
        .then((answer) => {
            console.log(answer);
            connection.query('DELETE FROM employee WHERE ?',
                { id: answer.employee },
                (err, res) => {
                    console.log(res);
                    if (err) throw err;
                    console.log('Your employee was deleted successfully!');
                    runSearch();
                  }
            );
        });
    })      
}

const viewRoles = () => {
    const query = 'SELECT * FROM employee_role';
    connection.query(query, (err, res) => {
        if (err) throw (err);
        console.log(`EMPLOYEE ROLES:`);
        console.table(res);
        runSearch();
    });
    
}

const addRole = () => {
    inquirer
    .prompt({
        name: 'title',
        type: 'input',
        message: 'What role would you like to add?',
        },
        {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for this role?',
        },
        {
        name: 'department',
        type: 'rawlist',
        message: 'What is the employees role?',
        choices: [
                'Sales',
                'Engineering',
                'Accounts',
                'Legal'
            ],
        }
    )
    .then((answer) => {
        connection.query('INSERT INTO employee_role SET ?',
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
            },
            (err) => {
                if (err) throw err;
                console.log('Your employee was created successfully!');
                runSearch();
              }
        );
    });
}

const viewDepartments = () => {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        if (err) throw (err);
        console.log(`DEPARTMENTS:`);
        console.table(res);
        runSearch();
    });
}


