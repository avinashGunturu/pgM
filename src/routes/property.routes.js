const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');

router.post('/create', propertyController.createProperty);
router.put('/update', propertyController.updateProperty); 
router.post('/list', propertyController.getProperties);
router.post('/delete', propertyController.deleteProperty);

module.exports = router;