const tokens = require('../services/tokenGenerator'),
  logger = require('../logger'),
  User = require('../models').user,
  errors = require('../errors');

const checkAllFields = object => {
  const errorField = [];
  Object.keys(object).forEach(key => {
    if (!object[key]) {
      errorField.push(`${key} cannot be null or empty`);
    }
  });
  return errorField;
};
exports.validateUser = object => {
  const errorMsgs = checkAllFields(object);
  const validMail = /@wolox.com.ar\s*$/,
    validPass = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;
  if (object.email && !object.email.match(validMail)) {
    errorMsgs.push('Email is not a valid email or not the @wolox.com.ar domain.');
  }
  if (object.password && !object.password.match(validPass)) {
    errorMsgs.push('Invalid password. Must be 8 alphanumeric characters or longer.');
  }
  return errorMsgs;
};
