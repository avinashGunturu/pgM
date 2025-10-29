const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');

router.post('/create', employeeController.createEmployee);
router.put('/update', employeeController.updateEmployee);
router.post('/list', employeeController.getEmployeesWithFiltersController);
router.post('/delete', employeeController.deleteEmployeeController);
module.exports = router;