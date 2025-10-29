const authService = require('../services/auth.service');
const { success, error } = require('../utils/response');

async function register(req, res) {
  try {
    const owner = await authService.registerOwner(req);    
    success(res, owner, 'Owner registered successfully', 201);
  } catch (err) {
    error(res, err.message, 500);
  }
}

async function login(req, res) {
  try {
    const { identifier, password } = req.body;
    const { token, ownerId, message } = await authService.loginOwner(identifier, password);
    success(res, { token, ownerId }, message, 200);
  } catch (err) {
    error(res, err.message, 401);
  }
}

async function verify(req, res) {
  try {
    await authService.verifyAccount(req.params.ownerId);
    success(res, null, 'Account Verified', 200);
  } catch (err) {
    error(res, err.message, 500);
  }
}

async function changePassword(req, res) {
  try {
    const { ownerId } = req.params;
    const { oldPassword, newPassword } = req.body;
    const result = await authService.changePassword(ownerId, oldPassword, newPassword);
    success(res, result.message, 'Password Changed Successfully', 200);
  } catch (err) {
    error(res, err.message, 400);
  }
}

module.exports = { register, login, verify, changePassword };