const Employee = require('../models/employee');

// Show List of Employees
exports.listEmployees = async (req, res) => {
  const employees = await Employee.findAll();
  res.render('employees/list', { employees, showLayout: false });
};


// Show Add Employee Form
exports.showAddForm = (req, res) => {
  res.render('employees/form', { employee: null });
};

// Handle Add Employee Submission
exports.addEmployee = async (req, res) => {
  const { name, email, status } = req.body;
  await Employee.create({
    name,
    email,
    status: status === 'on' ? true : false
  });
  res.redirect('/employees');
};

// Show Edit Employee Form
exports.showEditForm = async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  res.render('employees/form', { employee });
};

// Handle Edit Form Submission
exports.updateEmployee = async (req, res) => {
  const { name, email, status } = req.body;
  const employee = await Employee.findByPk(req.params.id);

  if (!employee) {
    return res.status(404).send('Employee not found');
  }

  employee.name = name;
  employee.email = email;
  employee.status = status === 'on' ? true : false;

  await employee.save();
  res.redirect('/employees');
};
