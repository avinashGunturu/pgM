const inventoryService = require('../services/inventory.service');
const { success, error } = require('../utils/response');

const createInventoryController = async (req, res) => {
  try {
    const inventoryData = req.body;
    const newInventory = await inventoryService.createInventory(inventoryData);
    success(res, newInventory, 'Inventory created successfully', 201); // 201 Created
  } catch (err) {
    error(res, err.message, err.statusCode || 400); // 400 for validation errors
  }
};


const getInventoriesController = async (req, res) => {
    try {
      const page = parseInt(req.body.page) || 1;
      const limit = parseInt(req.body.limit) || 10;
  
      const filters = {
        propertyId: req.body.propertyId,
        ownerId: req.body.ownerId,
        itemName: req.body.itemName,
        category: req.body.category,
        recurring: req.body.recurring,
        status: req.body.status,
        inventoryId:req.body.inventoryId
      };
  
      if (filters.recurring) {
        filters.recurring = filters.recurring.toLowerCase() === 'true'; // Ensure boolean conversion
      }
  
      const result = await inventoryService.getInventories(page, limit, filters);
      success(res, result, 'Inventories retrieved successfully', 200);
    } catch (err) {
      error(res, err.message, err.statusCode || 500);
    }
  };

  const updateInventoryController = async (req, res) => {
    try {
      const inventoryId = req.body.inventoryId;
      const {updateData} = req.body;
  
      const updatedInventory = await inventoryService.updateInventory(inventoryId, updateData);
      success(res, updatedInventory, 'Inventory updated successfully', 200);
    } catch (err) {
      error(res, err.message, err.statusCode || 500);
    }
  };


  const deleteInventoryController = async (req, res) => {
    try {
      const inventoryId = req.body.inventoryId;
      await inventoryService.deleteInventory(inventoryId);
      success(res, null, 'Inventory deleted successfully', 200); // 204 No Content
    } catch (err) {
      error(res, err.message, err.statusCode || 500);
    }
  };

module.exports = {
  createInventoryController,
  getInventoriesController,
  updateInventoryController,
  deleteInventoryController
};