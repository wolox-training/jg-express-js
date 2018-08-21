const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.INVALID_USER = 'Invalid_user';
exports.invalidUser = message => internalError(message, exports.INVALID_USER);

exports.DATABASE_ERROR = 'Database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);
