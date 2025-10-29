function success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      code: 0, // 0 for success
      message,
      data,
    });
  }
  
  function error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      code: 1, // 1 for failure
      message,
      errors,
    });
  }
  
  module.exports = { success, error };