const errors = require('../errors'),
  logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.INVALID_USER]: 400,
  [errors.USER_UNAUTHORIZED]: 401,
  [errors.INVALID_TOKEN]: 401,
  [errors.DEFAULT_ERROR]: 500,
  [errors.DATABASE_ERROR]: 500,
  [errors.FETCH_ERROR]: 500,
  [errors.REQUEST_ERROR]: 400
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) {
    res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  } else {
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
