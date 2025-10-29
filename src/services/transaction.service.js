const Transaction = require('../models/transaction.model');

async function createTransaction(transactionData) {
  try {
    const missingFields = [];
    
    if (!transactionData.ownerId) missingFields.push('ownerId');
    if (!transactionData.propertyId) missingFields.push('propertyId');
    if (!transactionData.transactionType) missingFields.push('transactionType');
    if (!transactionData.amount) missingFields.push('amount');
    if (!transactionData.currency) missingFields.push('currency');
    if (!transactionData.actualPaymentDate) missingFields.push('actualPaymentDate');
    if (!transactionData.transactionDate) missingFields.push('transactionDate');

    if (transactionData.transactionType === 'RENT' && !transactionData.tenantId) {
      missingFields.push('tenantId (required for rent)');
    }

    if (missingFields.length > 0) {
      throw new Error(`Missing mandatory fields: ${missingFields.join(', ')}`);
    }

    const transaction = new Transaction(transactionData);
    await transaction.save();
    return transaction;
  } catch (error) {
    throw error;
  }
}


async function getTransactions(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = {};
  
      if (filters.ownerId) query.ownerId = filters.ownerId;
      if (filters.propertyId) query.propertyId = filters.propertyId;
      if (filters.tenantId) query.tenantId = filters.tenantId;
      if (filters.transactionId) query._id = filters.transactionId;
      if (filters.status) query.status = filters.status;
  
      if (filters.startDate && filters.endDate) {
        query.transactionDate = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate),
        };
      } else if (filters.startDate) {
        query.transactionDate = { $gte: new Date(filters.startDate) };
      } else if (filters.endDate) {
        query.transactionDate = { $lte: new Date(filters.endDate) };
      }
  
      const transactions = await Transaction.find(query)
        .sort({ transactionDate: -1 })
        .skip(skip)
        .limit(limit);
  
      const totalTransactions = await Transaction.countDocuments(query);
  
      return {
        transactions,
        total:totalTransactions,
        currentPage: page,
        totalPages: Math.ceil(totalTransactions / limit),
      };
    } catch (error) {
      throw error;
    }
  }


  async function updateTransaction(transactionId, updateData) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
  
      const updateObject = {};
      const unsetObject = {};
  
      function flatten(obj, parentKey = '') {
        Object.keys(obj).forEach((key) => {
          const value = obj[key];
          const newKey = parentKey ? `${parentKey}.${key}` : key;
  
          if (value === null || value === undefined) {
            unsetObject[newKey] = 1;
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
  
      await Transaction.updateOne({ _id: transactionId }, updateQuery, { runValidators: false });
  
      const updatedTransaction = await Transaction.findById(transactionId);
      return updatedTransaction;
    } catch (error) {
      throw error;
    }
  }
  
  async function deleteTransaction(transactionId) {
    try {
      const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
      if (!deletedTransaction) {
        throw new Error('Transaction not found');
      }
      return { message: 'Transaction deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

module.exports = { createTransaction,getTransactions,updateTransaction,deleteTransaction };