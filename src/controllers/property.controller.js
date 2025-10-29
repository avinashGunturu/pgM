const propertyService = require('../services/property.service');
const { success, error } = require('../utils/response');


async function createProperty(req, res) {
    try {
      const propertyData = req.body;
      const newProperty = await propertyService.createProperty(propertyData);
      success(res, newProperty, 'Property created successfully', 201); // 201 Created
    } catch (err) {
      error(res, err.message, 400);
    }
  }

async function updateProperty(req, res) {
  try {
    const { propertyId, updateData } = req.body;
    const updatedProperty = await propertyService.updateProperty(propertyId, updateData);
    success(res, updatedProperty, 'Property updated successfully', 200);
  } catch (err) {
    error(res, err.message, 400);
  }
}

async function getProperties(req, res) {
    try {
      const { page, limit, ...filters } = req.body;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
  
      const result = await propertyService.getProperties(pageNum, limitNum, filters);
      success(res, result, 'Properties retrieved successfully', 200);
    } catch (err) {
      error(res, err.message, 500);
    }
  }

  async function deleteProperty(req, res) {
    try {
      const { propertyId } = req.body;
      const result = await propertyService.deleteProperty(propertyId);
      success(res, result, 'Property deleted successfully', 200);
    } catch (err) {
      error(res, err.message, 404); // Use 404 if property not found
    }
  }

module.exports = { createProperty,updateProperty,getProperties,deleteProperty };