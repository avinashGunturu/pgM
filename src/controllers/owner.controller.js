const ownerService = require('../services/owner.service');
const { success, error } = require('../utils/response');

async function getOwners(req, res) {
    try {
      const { page, limit, ...filters } = req.body; // Extract from body
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
  
      const result = await ownerService.getOwners(pageNum, limitNum, filters);
      success(res, result, 'Owners retrieved successfully', 200);
    } catch (err) {
      error(res, err.message, 500);
    }
  }

async function updateOwner(req, res) {
    try {
      const { ownerId, updateData } = req.body;
      const updatedOwner = await ownerService.updateOwner(ownerId, updateData);
      success(res, updatedOwner, 'Owner updated successfully', 200);
    } catch (err) {
      error(res, err.message, 400);
    }
}

async function deleteOwner(req, res) {
    try {
      const { ownerId } = req.body;
      const result = await ownerService.deleteOwner(ownerId);
      success(res, result, 'Owner deleted successfully', 200);
    } catch (err) {
      error(res, err.message, 404); // Use 404 if owner not found
    }
  }

module.exports = { getOwners, updateOwner,deleteOwner };
