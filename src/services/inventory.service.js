// 1. Service (services/inventory.service.js)
const Inventory = require('../models/inventory.model');

const createInventory = async (inventoryData) => {
    try {
      // Explicitly validate mandatory fields
      if (!inventoryData.itemName || inventoryData.quantity === undefined || inventoryData.pricePerUnit === undefined) {
        const missingFields = [];
        if (!inventoryData.itemName) missingFields.push('itemName');
        if (!inventoryData.propertyId) missingFields.push('propertyId');
        if (!inventoryData.ownerId) missingFields.push('ownerId');
        if (inventoryData.quantity === undefined) missingFields.push('quantity');
        if (inventoryData.pricePerUnit === undefined) missingFields.push('pricePerUnit');
  
        const error = new Error(`Mandatory fields are missing: ${missingFields.join(', ')}`);
        error.statusCode = 400;
        throw error;
      }
  
      const inventory = new Inventory(inventoryData);
      return await inventory.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        const detailedError = new Error(`Validation failed: ${validationErrors.join(', ')}`);
        detailedError.statusCode = 400;
        throw detailedError;
      }
      throw error;
    }
  };

  const getInventories = async (page = 1, limit = 10, filters = {}) => {
    try {
      const skip = (page - 1) * limit;
  
      const query = {};
  
      if (filters.propertyId) {
        query.propertyId = filters.propertyId;
      }
      if (filters.ownerId) {
        query.ownerId = filters.ownerId;
      }
      if (filters.inventoryId) {
        query._id = filters.inventoryId;
      }
      if (filters.itemName) {
        query.itemName = { $regex: filters.itemName, $options: 'i' };
      }
      if (filters.category) {
        query.category = { $regex: filters.category, $options: 'i' };
      }
      if (filters.recurring !== undefined) {
        query.recurring = filters.recurring === 'true'; // Convert to boolean
      }
      if (filters.status) {
        query.status = { $regex: filters.status, $options: 'i' };
      }

  
      const inventories = await Inventory.find(query)
        .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order
        .skip(skip)
        .limit(limit);
  
      const totalInventories = await Inventory.countDocuments(query);
  
      return {
        inventories,
        total: totalInventories,
        currentPage: page,
        totalPages: Math.ceil(totalInventories / limit),
      };
    } catch (error) {
      throw error;
    }
  };
  
  const updateInventory = async (inventoryId, updateData) => {
    try {
      const inventory = await Inventory.findById(inventoryId);
      if (!inventory) {
        const error = new Error('Inventory not found');
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
  
      await Inventory.updateOne({ _id: inventoryId }, updateQuery, { runValidators: false });
  
      const updatedInventory = await Inventory.findById(inventoryId);
      return updatedInventory;
    } catch (error) {
      throw error;
    }
  };
  
  const deleteInventory = async (inventoryId) => {
    try {
      const deletedInventory = await Inventory.findByIdAndDelete(inventoryId);
  
      if (!deletedInventory) {
        const error = new Error('Inventory not found');
        error.statusCode = 404;
        throw error;
      }
  
      return deletedInventory; // Return the deleted inventory, or just the status
    } catch (error) {
      throw error;
    }
  };


  
  module.exports = {
    createInventory,
    getInventories,
    updateInventory,
    deleteInventory
  };