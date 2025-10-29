const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  propertyName: { type: String, required: true },
  location: { type: String, required: true },
  totalFloors: { type: Number, required: true },
  floors: [{
    floorNumber: { type: Number, required: true },
    floorName: { type: String, required: true },
    totalRooms: { type: Number, required: true },
    rooms: [{
      roomId: { type: String, required: true },
      sharingType: { type: String, enum: ['2SHARING', '3SHARING', '4SHARING', '5SHARING', 'OTHER'] },
      capacity: { type: Number, required: true },
      currentOccupants: { type: Number, required: true },
      isAvailable: { type: Boolean, default: true },
      amenities: { type: [String] },
      notes: { type: String },
      occupants: [{ name: { type: String }, contact: { type: String } }],
      rentPerMonth: { type: Number },
      paymentStatus: { type: String, enum: ['PAID', 'PENDING', 'PARTIALLYPAID'] },
      maintenanceRequests: [{ issue: { type: String }, status: { type: String, enum: ['PENDING', 'INPROGRESS', 'COMPLETED'] } }],
    }],
  }],
}, { timestamps: true });

module.exports = mongoose.model('Floor', floorSchema);