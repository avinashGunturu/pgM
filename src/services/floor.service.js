    const Floor = require('../models/floor.model');

    async function createFloor(floorData) {
    const{
        propertyId,
        ownerId,
        propertyName,
        location,
        totalFloors,
    } = floorData;

    const missingFields = [];

        if (!propertyId) missingFields.push('propertyId');
        if (!ownerId) missingFields.push('ownerId');
        if (!propertyName) missingFields.push('propertyName');
        if (!totalFloors) missingFields.push('totalFloors');
        if (!location) missingFields.push('location');

        if (missingFields.length > 0) {
        return error(res, `Missing required fields: ${missingFields.join(', ')}`, 400);
        }


    const floors = [];
    for (let i = 1; i <= totalFloors; i++) {
        let floorName;
        if (i === 1) {
        floorName = 'Ground Floor';
        } else if (i === 2) {
        floorName = 'First Floor';
        } else if (i === 3) {
        floorName = 'Second Floor';
        } else {
        floorName = `${i - 1}th Floor`;
        }
        floors.push({
        floorNumber: i,
        floorName: floorName,
        totalRooms: 0,
        rooms: [],
        });
    }

    const newFloor = new Floor({
        propertyId,
        ownerId,
        propertyName,
        location,
        totalFloors,
        floors: floors,
    });

    return newFloor.save();
    }

async function getAllFloors(filters, page, limit) {
  try {
    const query = {};

    if (filters.ownerId) {
      query.ownerId = filters.ownerId;
    }
    if (filters.propertyId) {
      query.propertyId = filters.propertyId;
    }
    if (filters.location) {
      query.location = filters.location;
    }
    if (filters.propertyName) {
      query.propertyName = filters.propertyName;
    }

    const skip = (page - 1) * limit;

    const floors = await Floor.find(query)
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (latest first)
      .skip(skip)
      .limit(limit);

    const totalCount = await Floor.countDocuments(query);

    return {
      floors,
      total:totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { createFloor, getAllFloors };
