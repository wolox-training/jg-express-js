const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.INVALID_USER = 'Invalid_user';
exports.invalidUser = message => internalError(message, exports.INVALID_USER);

exports.REQUEST_ERROR = 'Request_error';
exports.requestError = message => internalError(message, exports.REQUEST_ERROR);

exports.DATABASE_ERROR = 'Database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.INVALID_TOKEN = 'Invalid_token';
exports.invalidToken = message => internalError(message, exports.INVALID_TOKEN);

exports.USER_UNAUTHORIZED = 'User_unauthorized';
exports.userUnauthorized = message => internalError(message, exports.USER_UNAUTHORIZED);

exports.NOT_FOUND = 'Not_found';
exports.notFound = message => internalError(message, exports.NOT_FOUND);

exports.FETCH_ERROR = 'Fetch_error';
exports.fetchError = message => internalError(message, exports.FETCH_ERROR);

exports.DATA_CONFLICT = 'Data_conflict';
exports.dataConflict = message => internalError(message, exports.DATA_CONFLICT);
