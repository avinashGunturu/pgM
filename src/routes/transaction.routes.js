const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

router.post('/create',transactionController.createTransaction);
router.post('/list', transactionController.getTransactions);
router.put('/update', transactionController.updateTransaction);
router.post('/delete', transactionController.deleteTransaction);


module.exports = router;