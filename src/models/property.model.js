const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  propertyName: { type: String, required: true,unique: true },
  propertyType: { type: String, required: true, enum: ['PG', 'HOSTEL', 'APARTMENT', 'HOUSE', 'VILLA', 'COLIVE', 'OTHER'] },
  propertyDescription: { type: String },
  propertyAddress: {
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  contactDetails: {
    phoneNumber: { type: String },
    email: { type: String },
  },
  highlightedAmenities: [
    {
      name: { type: String },
      description: { type: String },
    },
  ],
  amenities: [
    {
      name: { type: String },
      description: { type: String },
    },
  ],
  sharingOptions: [
    {
      sharingType: { type: String, enum: ['SINGLE', 'DOUBLE', 'TRIPLE', 'FOURSHARING', 'FIVESHARING', 'OTHER']},
      monthlyRent: { type: Number },
      deposit: { type: Number },
      amenities: [{ type: String }],
      images: [{ type: String }],
      description: { type: String },
      contactPerson: { type: String },
      contactNumber: { type: String },
      contactEmail: { type: String },
      virtualTourUrl: { type: String },
      '360Images': [{ type: String }],
      depositBreakdown: {
        damages: { type: Number },
        cleaning: { type: Number },
        other: { type: Number },
      },
      updatedAt: { type: Date },
      updatedBy: { type: String },
    },
  ],
  rulesAndRegulations: [{ type: String }],
  images: [{ type: String }],
  facilities: {
    totalRooms: { type: Number },
    totalFloors: { type: Number },
    totalBedCapacity: { type: Number },
    kitchenAvailable: { type: Boolean },
    commonAreaAvailable: { type: Boolean },
    parkingAvailable:{type:Boolean}   
  },
  floors: [
    {
      floorNumber: { type: Number, required: true }, // e.g., 1, 2, 3 for 1st, 2nd, 3rd floor
      rooms: [
        {
          roomName: { type: String, required: true }, // e.g., "Deluxe Room"
          roomNo: { type: String, required: true }, // e.g., "101", "A-12"
          noOfBeds: { type: Number, required: true, min: 1 }, // Number of beds in the room
          noOfBedsOccupiedu: { type: Number, required: false,default:0}, // Number of beds in the room
          sharingOption: { 
            type: String, 
            enum: ['SINGLE', 'DOUBLE', 'TRIPLE', 'FOURSHARING', 'FIVESHARING', 'OTHER'],
            required: true 
          }, // Links to sharingOptions.sharingType
          metadata: { 
            type: mongoose.Schema.Types.Mixed, // Flexible object for future fields
            default: {} 
          }, // e.g., { "lastMaintenance": "2025-08-01", "customField": "value" }
        },
      ],
    },
  ],
  availability: {
    availableFrom: { type: Date },
  },
  nearbyLocations: [
    {
      name: { type: String },
      distance: { type: String },
      type: { type: String, enum: ['TRANSPORTATION', 'SHOPPING', 'HEALTHCARE', 'EDUCATION', 'ENTERTAINMENT', 'OTHER'] },
    },
  ],
  totalOccupiedBeds : {type:Number},
  
  foodDetails: [
    {
      mealType: { type: String, enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS'] },
      timings: { type: String },
      weeklyMenu: [
        {
          day: { type: String, enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] },
          menu: [{ type: String }],
        },
      ],
      description: { type: String },
    },
  ],
  videoTourUrl: { type: String },
  floorPlanUrl: { type: String },
  paymentOptions: [{ type: String }],
  targetDemographics: [{ type: String }],
  propertyStatus: { type: String, enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'UNDER REVIEW'], default: 'ACTIVE' },
  audit: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
},
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Property', propertySchema);



