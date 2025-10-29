const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant',required:false },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  transactionType: { type: String, enum: ['INCOME', 'EXPENSE', 'RENT'], required: true },
  transactionSubType: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['INR', 'USD', 'EUR'], required: true },
  transactionDate: { type: String, required: true },
  actualPaymentDate: { type: String,required: true },
  paidDate: { type: String },
  paymentMethod: { type: String},
  status: { type: String, enum: ['PAID', 'PENDING', 'FAILED','DUE'],default: 'PENDING' },
  description: { type: String },
  externalPaymentId: { type: String }, // Add externalPaymentId
  incomeDetails: {
    source: { type: String },
    receivedFrom: { type: String },
    paymentReference: { type: String },
    notes: { type: String },
  },
  expenseDetails: {
    category: { type: String },
    vendor: { type: String },
    invoiceNumber: { type: String },
    paymentReference: { type: String },
    notes: { type: String },
  },
  rentDetails: {
    rentStartDate: { type: String },
    rentEndDate: { type: String },
  },
  documentList: [{
    documentUrl: { type: String },
    documentId: { type: String },
    documentType: { type: String },
    description: { type: String },
  }],
  audit: {
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String },
  },
},
  {
    timestamps: true, // Adds createdAt and updatedAt
  });

module.exports = mongoose.model('Transaction', transactionSchema);