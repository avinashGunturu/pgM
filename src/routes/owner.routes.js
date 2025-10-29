const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner.controller');

router.post('/',ownerController.getOwners); 
router.put('/update',ownerController.updateOwner); 
router.delete('/delete', ownerController.deleteOwner);

module.exports = router;