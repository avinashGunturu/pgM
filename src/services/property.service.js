const Property = require('../models/property.model');


async function createProperty(propertyData) {
  try {
    const missingFields = [];

    if (!propertyData.ownerId) missingFields.push('ownerId');
    if (!propertyData.propertyName) missingFields.push('propertyName');
    if (!propertyData.propertyType) missingFields.push('propertyType');
    if (!propertyData.propertyDescription) missingFields.push('propertyDescription');
    if (!propertyData.propertyAddress) missingFields.push('propertyAddress');
    if (!propertyData.propertyAddress || !propertyData.propertyAddress.addressLine1) missingFields.push('propertyAddress.addressLine1');
    if (!propertyData.propertyAddress || !propertyData.propertyAddress.city) missingFields.push('propertyAddress.city');
    if (!propertyData.propertyAddress || !propertyData.propertyAddress.state) missingFields.push('propertyAddress.state');
    if (!propertyData.propertyAddress || !propertyData.propertyAddress.pincode) missingFields.push('propertyAddress.pincode');
    if (!propertyData.contactDetails) missingFields.push('contactDetails');
    if (!propertyData.contactDetails || !propertyData.contactDetails.phoneNumber) missingFields.push('contactDetails.phoneNumber');
    if (!propertyData.contactDetails || !propertyData.contactDetails.email) missingFields.push('contactDetails.email');

    if (missingFields.length > 0) {
      throw new Error(`Missing mandatory fields: ${missingFields.join(', ')}`);
    }

    const property = new Property(propertyData);
    await property.save();
    return property;
  } catch (error) {
    throw error;
  }
}


async function updateProperty(propertyId, updateData) {
  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    const updateObject = {};
    const unsetObject = {};

    // function flatten(obj, parentKey = '') {
    //   Object.keys(obj).forEach((key) => {
    //     const value = obj[key];
    //     const newKey = parentKey ? `${parentKey}.${key}` : key;

    //     if (value === null || value === undefined) {
    //       unsetObject[newKey] = 1; // Correct: Use 1 for $unset
    //     } else if (typeof value === 'object' && value !== null) {
    //       flatten(value, newKey);
    //     } else {
    //       updateObject[newKey] = value;
    //     }
    //   });
    // }

    function flatten(obj, parentKey = '') {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (value === null || value === undefined) {
          unsetObject[newKey] = 1;
        } else if (Array.isArray(value)) {
          updateObject[newKey] = value;
        } else if (typeof value === 'object') {
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

    await Property.updateOne({ _id: propertyId }, updateQuery, { runValidators: false });

    const updatedProperty = await Property.findById(propertyId);
    return updatedProperty;
  } catch (error) {
    throw error;
  }
}


async function getProperties(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
  
      const query = {};
  
      if (filters.propertyName) {
        query.propertyName = { $regex: filters.propertyName, $options: 'i' };
      }
      if (filters.propertyType) {
        query.propertyType = filters.propertyType;
      }
      if (filters.state) {
        query['propertyAddress.state'] = { $regex: filters.state, $options: 'i' };
      }
      if (filters.pincode) {
        query['propertyAddress.pincode'] = filters.pincode;
      }
      if (filters.propertyStatus) {
        query.propertyStatus = filters.propertyStatus;
      }

      if(filters.ownerId){
          query.ownerId = filters.ownerId
      }

      if(filters.id){
         query._id = filters.id
      }
  
      const properties = await Property.find(query).sort({ 'audit.createdAt': -1 }).skip(skip).limit(limit);
      const totalProperties = await Property.countDocuments(query);
  
      return {
        properties,
        total:totalProperties,
        currentPage: page,
        totalPages: Math.ceil(totalProperties / limit),
      };
    } catch (error) {
      throw error;
    }
  }

  async function deleteProperty(propertyId) {
    try {
      const deletedProperty = await Property.findByIdAndDelete(propertyId);
      if (!deletedProperty) {
        throw new Error('Property not found');
      }
      return { message: 'Property deleted successfully' };
    } catch (error) {
      throw error;
    }
  }


module.exports = { createProperty,updateProperty,getProperties,deleteProperty };