module.exports = (message, status, statusCode) => {
  const error = new Error();
  error.message = message;
  error.status = status;
  error.statusCode = statusCode;
  return error;
};
