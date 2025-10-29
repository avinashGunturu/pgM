const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  ownerName: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  profilePicUrl: { type: String },
  contact: {
    mobileNumber: { type: String, required: true, unique: true },
    alternativeNumber: { type: String },
    email: { type: String, required: true, unique: true },
    address: {
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
  },
  authentication: {
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    otpEnabled: { type: Boolean, default: false },
    lastOtpSent: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    accountLocked: { type: Boolean, default: false },
    accountVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
  },
  emergencyContact: {
    name: { type: String },
    relation: { type: String },
    mobileNumber: { type: String },
  },
  propertiesOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  documents: [
    {
      documentId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      documentType: { type: String },
      documentUrl: { type: String },
      expirationDate: { type: Date },
    },
  ],
  bankDetails: {
    accountHolderName: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
  },
  audit: {
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String },
    changeHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        changedBy: { type: String },
        changes: { type: mongoose.Schema.Types.Mixed },
      },
    ],
  },
  role: { type: String, default: 'owner' }, // Add role field
  permissions: [{ type: String }], // Add permissions array
  ownerStatus: { type: String, enum: ['active', 'inactive', 'pending', 'blocked'], default: 'pending' }, // Add owner status
},
{
  timestamps: true, // Adds createdAt and updatedAt
}
);

module.exports = mongoose.model('Owner', ownerSchema);