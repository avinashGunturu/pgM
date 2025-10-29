const employeeService = require('../services/employee.service');
const { success, error } = require('../utils/response');

const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    const employee = await employeeService.createEmployee(employeeData);
    success(res, employee, 'Employee created successfully', 201);
  } catch (err) {
    error(res, err.message, err.statusCode || 400); // Use error.statusCode if available
  }
};

const updateEmployee = async (req, res) => {
  try {
    const {employeeId,updateData} = req.body;
    const updatedEmployee = await employeeService.updateEmployee(employeeId, updateData);
    success(res, updatedEmployee, 'Employee updated successfully', 200);
  } catch (err) {
    error(res, err.message, err.statusCode || 400);
  }
};

const getEmployeesWithFiltersController = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;

    const filters = {
      employeeId:req.body.employeeId,
      propertyId: req.body.propertyId,
      ownerId: req.body.ownerId,
      name: req.body.name,
      mobileNumber: req.body.mobileNumber,
      role: req.body.role,
    };

    const result = await employeeService.getEmployeesWithFilters(page, limit, filters);
    success(res, result, 'Employees retrieved successfully', 200);
  } catch (err) {
    error(res, err.message, err.statusCode || 500);
  }
};


const deleteEmployeeController = async (req, res) => {
  try {
    const employeeId = req.body.employeeId;
    await employeeService.deleteEmployee(employeeId);
    success(res, null, 'Employee deleted successfully', 200); // 204 No Content
  } catch (err) {
    error(res, err.message, err.statusCode || 500);
  }
};

module.exports = {
  createEmployee,
  updateEmployee,
  getEmployeesWithFiltersController,
  deleteEmployeeController
};