const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
    itemName: { type: String, required: true },
    category: { type: String },
    quantity: { type: Number, required: true, min: 0 },
    pricePerUnit: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' }, // Default currency
    totalValue: { type: Number },
    recurring: { type: Boolean, default: false },
    maintenanceFrequency: { type: String },
    supplier: {
      supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
      supplierName: { type: String },
      contactNumber: { type: String },
      email: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String },
      },
    },
    transactionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    maintenance: [
      {
        type: { type: String },
        date: { type: Date },
        cost: { type: Number, min: 0 },
        currency: { type: String, default: 'INR' }, // Default maintenance currency
        responsiblePerson: {
          name: { type: String },
          contact: {
            phone: { type: String },
            email: { type: String },
          },
          role: { type: String },
        },
        scheduledDate: { type: Date },
        note: { type: String },
      },
    ],
    status: { type: String, enum: ['Active', 'Inactive', 'Disposed'] },
    notes: { type: String },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Inventory', inventorySchema);