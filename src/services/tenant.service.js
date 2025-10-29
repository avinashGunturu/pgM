const Tenant = require('../models/tenant.model');

async function createTenant(tenantData) {
  try {
    const missingFields = [];

    if (!tenantData.ownerId) missingFields.push('ownerId');
    if (!tenantData.propertyId) missingFields.push('propertyId');
    if (!tenantData.personalInfo) missingFields.push('personalInfo');
    if (!tenantData.personalInfo || !tenantData.personalInfo.firstName) missingFields.push('personalInfo.firstName');
    if (!tenantData.personalInfo || !tenantData.personalInfo.lastName) missingFields.push('personalInfo.lastName');
    if (!tenantData.personalInfo || !tenantData.personalInfo.gender) missingFields.push('personalInfo.gender');
    if (!tenantData.personalInfo || !tenantData.personalInfo.maritalStatus) missingFields.push('personalInfo.maritalStatus');
    if (!tenantData.personalInfo || !tenantData.personalInfo.age) missingFields.push('personalInfo.age');
    if (!tenantData.personalInfo || !tenantData.personalInfo.dob) missingFields.push('personalInfo.dob');
    if (!tenantData.contactInfo) missingFields.push('contactInfo');
    if (!tenantData.contactInfo || !tenantData.contactInfo.address) missingFields.push('contactInfo.address');
    if (!tenantData.contactInfo || !tenantData.contactInfo.address.addressLine1) missingFields.push('contactInfo.address.addressLine1');
    if (!tenantData.contactInfo || !tenantData.contactInfo.address.city) missingFields.push('contactInfo.address.city');
    if (!tenantData.contactInfo || !tenantData.contactInfo.address.state) missingFields.push('contactInfo.address.state');
    if (!tenantData.contactInfo || !tenantData.contactInfo.address.pincode) missingFields.push('contactInfo.address.pincode');
    if (!tenantData.contactInfo || !tenantData.contactInfo.address.country) missingFields.push('contactInfo.address.country');
    if (!tenantData.contactInfo || !tenantData.contactInfo.mobileNumber) missingFields.push('contactInfo.mobileNumber');
    if (!tenantData.contactInfo || !tenantData.contactInfo.email) missingFields.push('contactInfo.email');
    if (!tenantData.audit) missingFields.push('audit');
    if (!tenantData.audit || !tenantData.audit.createdBy) missingFields.push('audit.createdBy');
    if (!tenantData.audit || !tenantData.audit.createdByUserId) missingFields.push('audit.createdByUserId');

    if (missingFields.length > 0) {
      throw new Error(`Missing mandatory fields: ${missingFields.join(', ')}`);
    }

    const tenant = new Tenant(tenantData);
    await tenant.save();
    return tenant;
  } catch (error) {
    throw error;
  }
}



async function getTenants(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
  
      const query = {};

  
      if (filters.name) {
        query['$or'] = [
          { 'personalInfo.firstName': { $regex: filters.name, $options: 'i' } },
          { 'personalInfo.lastName': { $regex: filters.name, $options: 'i' } },
        ];
      }
      if (filters.mobile) {
        query['contactInfo.mobileNumber'] = { $regex: filters.mobile, $options: 'i' };
      }
      if (filters.email) {
        query['contactInfo.email'] = { $regex: filters.email, $options: 'i' };
      }
      if (filters.tenantId) {
        query._id = filters.tenantId;
      }
      if (filters.ownerId) {
        query.ownerId = filters.ownerId;
      }
      if (filters.propertyId) {
        query.propertyId = filters.propertyId;
      }
      if (filters.state) {
        query['contactInfo.address.state'] = { $regex: filters.state, $options: 'i' };
      }
      if (filters.city) {
        query['contactInfo.address.city'] = { $regex: filters.city, $options: 'i' };
      }
      if (filters.maritalStatus) {
        query['personalInfo.maritalStatus'] = filters.maritalStatus;
      }
  
      const tenants = await Tenant.find(query)
        .sort({ 'audit.createdAt': -1 })
        .skip(skip)
        .limit(limit);
  
      const totalTenants = await Tenant.countDocuments(query);
  
      return {
        tenants,
        total:totalTenants,
        currentPage: page,
        totalPages: Math.ceil(totalTenants / limit),
      };
    } catch (error) {
      throw error;
    }
  }
  
  async function updateTenant(tenantId, updateData) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        throw new Error('Tenant not found');
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
  
      await Tenant.updateOne({ _id: tenantId }, updateQuery, { runValidators: false });
  
      const updatedTenant = await Tenant.findById(tenantId);
      return updatedTenant;
    } catch (error) {
      throw error;
    }
  }

  async function deleteTenant(tenantId) {
    try {
      const deletedTenant = await Tenant.findByIdAndDelete(tenantId);
      if (!deletedTenant) {
        throw new Error('Tenant not found');
      }
      return { message: 'Tenant deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

module.exports = { createTenant,getTenants,updateTenant,deleteTenant };