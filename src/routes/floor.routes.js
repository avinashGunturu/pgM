const express = require('express');
const router = express.Router();
const floorController = require('../controllers/floor.controller');

router.post('/create', floorController.createFloor);
router.post('/list', floorController.getAllFloors);


module.exports = router;