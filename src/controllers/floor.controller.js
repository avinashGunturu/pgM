const floorService = require('../services/floor.service');
const { success, error } = require('../utils/response');

async function createFloor(req, res) {
  try {
    const { propertyId, ownerId, propertyName, location, totalFloors } = req.body;

    

    const floorData = {
      propertyId,
      ownerId,
      propertyName,
      location,
      totalFloors,
    };

    const savedFloor = await floorService.createFloor(floorData); // Call service with floorData

    success(res, savedFloor, 'Floor created successfully', 201);
  } catch (err) {
    error(res, err.message, 500);
  }
}


async function getAllFloors(req, res) {
    try {
      const {
        propertyId,
        ownerId,
        propertyName,
        location,
      } = req.body;

      const {page} = parseInt(req.body.page) || 1;
      const {limit} = parseInt(req.body.limit) || 10;

      const filters = {
        propertyId,
        ownerId,
        propertyName,
        location,
      };
  
      const result = await floorService.getAllFloors(filters, page, limit);
      success(res, result, 'Floors retrieved successfully', 200);
    } catch (err) {
      error(res, err.message, 500);
    }
  }

module.exports = { createFloor,getAllFloors };