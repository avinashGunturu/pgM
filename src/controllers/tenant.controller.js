const tenantService = require('../services/tenant.service');
const { success, error } = require('../utils/response');

async function createTenant(req, res) {
  try {
    const tenantData = req.body;
    const newTenant = await tenantService.createTenant(tenantData);
    success(res, newTenant, 'Tenant created successfully', 201);
  } catch (err) {
    error(res, err.message, 400);
  }
}

async function getTenants(req, res) {
    try {
      const { page, limit, ...filters } = req.body;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
  
      const result = await tenantService.getTenants(pageNum, limitNum, filters);
      success(res, result, 'Tenants retrieved successfully', 200);
    } catch (err) {
      error(res, err.message, 500);
    }
  }

  async function updateTenant(req, res) {
    try {
      const { tenantId, updateData } = req.body;
      const updatedTenant = await tenantService.updateTenant(tenantId, updateData);
      success(res, updatedTenant, 'Tenant updated successfully', 200);
    } catch (err) {
      error(res, err.message, 400);
    }
  }

  async function deleteTenant(req, res) {
    try {
      const { tenantId } = req.body;
      const result = await tenantService.deleteTenant(tenantId);
      success(res, result, 'Tenant deleted successfully', 200);
    } catch (err) {
      error(res, err.message, 404);
    }
  }

module.exports = { createTenant,getTenants,updateTenant,deleteTenant };