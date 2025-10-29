const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');

router.post('/list', tenantController.getTenants);
router.post('/create',tenantController.createTenant);
router.put('/update', tenantController.updateTenant);
router.delete('/delete', tenantController.deleteTenant);

module.exports = router;