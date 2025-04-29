const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/employees', employeeController.listEmployees);
router.get('/employees/add', employeeController.showAddForm);
router.post('/employees/add', employeeController.addEmployee);
router.get('/employees/edit/:id', employeeController.showEditForm);
router.post('/employees/edit/:id', employeeController.updateEmployee);

module.exports = router;
