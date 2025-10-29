const Employee = require('../models/employee.model');

const createEmployee = async (employeeData) => {
  try {
    // Validate mandatory fields
    const { firstName, phone, gender, dateOfBirth, propertyId, ownerId } = employeeData;

    if (!firstName || !phone || !gender || !dateOfBirth || !propertyId || !ownerId) {
      let missingFields = [];
      if (!firstName) missingFields.push('firstName');
      if (!phone) missingFields.push('phone');
      if (!gender) missingFields.push('gender');
      if (!dateOfBirth) missingFields.push('dateOfBirth');
      if (!propertyId) missingFields.push('propertyId');
      if (!ownerId) missingFields.push('ownerId');

      const error = new Error(`Mandatory fields are missing: ${missingFields.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const employee = new Employee(employeeData);
    return await employee.save();
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      const validationErrors = Object.values(error.errors).map(err => err.message);
      const detailedError = new Error(`Validation failed: ${validationErrors.join(', ')}`);
      detailedError.statusCode = 400;
      throw detailedError;
    }
    // Other errors
    throw error;
  }
};

const updateEmployee = async (employeeId, updateData) => {

 
  
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    const updateObject = {};
    const unsetObject = {};

    function flatten(obj, parentKey = '') {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (value === null || value === undefined) {
          unsetObject[newKey] = 1;
        } else if (typeof value === 'object' && value !== null) {
          flatten(value, newKey);
        } else {
          updateObject[newKey] = value;
        }
      });
    }

    flatten(updateData);

    const updateQuery = {};
    if (Object.keys(updateObject).length > 0) {
      updateQuery.$set = updateObject;
    }
    if (Object.keys(unsetObject).length > 0) {
      updateQuery.$unset = unsetObject;
    }

    await Employee.updateOne({ _id: employeeId }, updateQuery, { runValidators: false });

    const updatedEmployee = await Employee.findById(employeeId);
    return updatedEmployee;
  } catch (error) {
    throw error;
  }
};


const getEmployeesWithFilters = async (page = 1, limit = 10, filters = {}) => {
  try {
    const skip = (page - 1) * limit;

    const query = {};

    if (filters.propertyId) {
      query.propertyId = filters.propertyId;
    }
    if (filters.ownerId) {
      query.ownerId = filters.ownerId;
    }
    if (filters.name) {
      query['$or'] = [
        { firstName: { $regex: filters.name, $options: 'i' } },
        { lastName: { $regex: filters.name, $options: 'i' } },
      ];
    }
    if (filters.mobileNumber) {
      query['phone.number'] = { $regex: filters.mobileNumber, $options: 'i' };
    }
    if (filters.role) {
      query.role = { $regex: filters.role, $options: 'i' };
    }
    if (filters.employeeId) {
      query._id = filters.employeeId;
    }

    const employees = await Employee.find(query)
      .sort({ lastUpdated: -1 })
      .skip(skip)
      .limit(limit);

    const totalEmployees = await Employee.countDocuments(query);

    return {
      employees,
      total: totalEmployees,
      currentPage: page,
      totalPages: Math.ceil(totalEmployees / limit),
    };
  } catch (error) {
    throw error;
  }
};

const deleteEmployee = async (employeeId) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    return deletedEmployee;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEmployee,
  updateEmployee,
  getEmployeesWithFilters,
  deleteEmployee
};