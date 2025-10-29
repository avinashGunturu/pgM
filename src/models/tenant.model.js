const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  version: { type: Number, default: 1 },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherFirstName: { type: String },
    fatherLastName: { type: String },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'] },
    maritalStatus: { type: String, enum: ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] },
    age: { type: Number },
    dob: { type: Date },
  },
  contactInfo: {
    address: {
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String },
    },
    mobileNumber: { type: String, required: true },
    alternativeNumber: { type: String },
    email: { type: String },
  },
  education: { type: String }, // Or [{ degree: String, institution: String, year: Number }]
  employment: {
    designation: { type: String },
    presentEmployedAt: { type: String },
    officeAddress: {
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String },
    },
    officeMobileNumber: { type: String },
  },
  profilePic: { type: String }, // URL or path
  documentProofs: [
    {
      type: { type: String },
      id: { type: String },
      uploadedAt: { type: Date },
      documentUrl: { type: String },
      expiryDate: { type: Date },
    },
  ],
  roomDetails: {
    floor: { type: Number },
    roomNumber: { type: String },
    roomType: { type: String },
  },
  financials: {
    payPerMonth: { type: Number },
    deposit: { type: Number },
    paymentMethod: { type: String },
    rentDueDate: { type: Date },
  },
  leaseDetails: {
    leaseStartDate: { type: Date },
    leaseEndDate: { type: Date },
  },
  emergencyContacts: [
    {
      name: { type: String },
      relation: { type: String },
      contactNumber: { type: String },
    },
  ],
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'EVICTED'], default: 'PENDING' },
  declaration: { type: Boolean },
  notes: { type: String },
  notesHistory: [{ note: String, date: { type: Date, default: Date.now } }],
  audit: {
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String },
    createdByUserId: { type: String },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String },
    updatedByUserId: { type: String },
    changeHistory: [{ timestamp: { type: Date, default: Date.now }, changedByUserId: String, changes: mongoose.Schema.Types.Mixed }],
  },
}
,
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Tenant', tenantSchema);