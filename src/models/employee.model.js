const { string } = require('joi');
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: {
    countryCode: { type: String },
    number: { type: String },
  },
  email: { type: String},
  role: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dateOfBirth: { type: String },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
  },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
  propertyName:{type:String},
  joiningDate: { type: Date },
  endDate: { type: Date },
  reasonForLeaving: { type: String },
  employmentType: { type: String, enum: ['Permanent', 'Contract', 'Temporary'] },
  workLocation: { type: String, enum: ['On-site', 'Remote', 'Hybrid'] },
  salary: {
    salaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salary' }, // Reference to Salary schema
  },
  status: { type: String, enum: ['active', 'inactive', 'onLeave'] },
  leaveDetails: {
    leaveDetailsId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeaveDetails' }, // Reference to LeaveDetails schema
  },
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phone: {
      countryCode: { type: String },
      number: { type: String },
    },
    address: { type: String },
  },
  documents: [
    {
      type: { type: String, required: true },
      documentNumber: { type: String },
      uploadedAt: { type: Date, default: Date.now },
      documentUrl: { type: String },
      documentData: { type: Buffer }, // Storing the document data as a Buffer
    },
  ],
  workShift: { type: String, enum: ['Day Shift', 'Night Shift', 'Rotating'] },
  lastUpdated: { type: Date, default: Date.now },
},
{
  timestamps: true, // Adds createdAt and updatedAt
}
);

module.exports = mongoose.model('Employee', employeeSchema);