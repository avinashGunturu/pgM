const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');

router.post('/create', inventoryController.createInventoryController);
router.post('/list', inventoryController.getInventoriesController);
router.put('/update', inventoryController.updateInventoryController);
router.post('/delete', inventoryController.deleteInventoryController);

module.exports = router;