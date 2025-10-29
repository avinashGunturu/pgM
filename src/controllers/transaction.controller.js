const transactionService = require('../services/transaction.service');
const { success, error } = require('../utils/response');

async function createTransaction(req, res) {
  try {
    const transactionData = req.body;
    const newTransaction = await transactionService.createTransaction(transactionData);
    success(res, newTransaction, 'Transaction created successfully', 201);
  } catch (err) {
    error(res, err.message, 400);
  }
}

async function getTransactions(req, res) {
    try {
      const { page, limit, ...filters } = req.body;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
  
      const result = await transactionService.getTransactions(pageNum, limitNum, filters);
      success(res, result, 'Transactions retrieved successfully', 200);
    } catch (err) {
      error(res, err.message, 500);
    }
  }
  async function updateTransaction(req, res) {
    try {
      const { transactionId, updateData } = req.body;
      const updatedTransaction = await transactionService.updateTransaction(transactionId, updateData);
      success(res, updatedTransaction, 'Transaction updated successfully', 200);
    } catch (err) {
      error(res, err.message, 400);
    }
  }

  async function deleteTransaction(req, res) {
    try {
      const { transactionId } = req.body;
      const result = await transactionService.deleteTransaction(transactionId);
      success(res, result, 'Transaction deleted successfully', 200);
    } catch (err) {
      error(res, err.message, 404);
    }
  }

module.exports = { createTransaction,getTransactions,updateTransaction,deleteTransaction };