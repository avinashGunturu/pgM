const { log } = require('winston');
const Owner = require('../models/owner.model');


async function getOwners(page = 1, limit = 10, filters = {}) {
  try {
    const skip = (page - 1) * limit;

    // Build filter object
    const query = {};
    if (filters.email) {
      query['contact.email'] = { $regex: filters.email, $options: 'i' };
    }
    if (filters.mobileNumber) {
      query['contact.mobileNumber'] = { $regex: filters.mobileNumber, $options: 'i' };
    }
    if (filters.role) {
      query.role = filters.role;
    }
    if (filters.ownerStatus) {
      query.ownerStatus = filters.ownerStatus;
    }
    if (filters.id) {
      query._id = filters.id;
    }

    const owners = await Owner.find(query)
      .sort({ 'audit.createdAt': -1 })
      .skip(skip)
      .limit(limit);

    const totalOwners = await Owner.countDocuments(query);

    // Remove authentication field from each owner object
    const ownersWithoutAuth = owners.map(owner => {
      const { authentication , ...ownerWithoutAuth } = owner.toObject();
      const resultOwnerData = {
      ...ownerWithoutAuth,
      "authentication":{
       otpEnabled: authentication.otpEnabled,
       lastOtpSent: authentication.lastOtpSent,
       failedLoginAttempts: authentication.failedLoginAttempts,
       accountLocked: authentication.accountLocked,
       accountVerified: authentication.accountVerified,
       lastLogin: authentication.lastLogin,
      }
   }
      return resultOwnerData;
    });

 

    return {
      owners: ownersWithoutAuth, // Send the modified array
      total:totalOwners,
      currentPage: page,
      totalPages: Math.ceil(totalOwners / limit),
    };
  } catch (error) {
    throw error;
  }
}

async function updateOwner(ownerId, updateData) {
  try {
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      throw new Error('Owner not found');
    }

    const updateObject = {};
    const unsetObject = {};

    function flatten(obj, parentKey = '') {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (value === null || value === undefined) {
          unsetObject[newKey] = 1; // Correct: Use 1 for $unset
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

    // Exclude 'authentication' from updates
    if (updateQuery.$set && updateQuery.$set.authentication) {
      delete updateQuery.$set.authentication;
    }
    if (updateQuery.$unset && updateQuery.$unset.authentication) {
      delete updateQuery.$unset.authentication;
    }

    await Owner.updateOne({ _id: ownerId }, updateQuery, { runValidators: false });

    const updatedOwner = await Owner.findById(ownerId);
    const { authentication, ...ownerWithoutAuth } = updatedOwner.toObject();
    return ownerWithoutAuth;
  } catch (error) {
    console.error('Error during owner update:', error);
    throw new Error(error.message);
  }
}

async function deleteOwner(ownerId) {
    try {
      const deletedOwner = await Owner.findByIdAndDelete(ownerId);
      if (!deletedOwner) {
        throw new Error('Owner not found');
      }
      return { message: 'Owner deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  
module.exports = { getOwners, updateOwner,deleteOwner};