const tokens = require('../services/tokenGenerator'),
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

exports.validateToken = (req, res, next) => {
  const token = req.headers[tokens.headerName];
  if (token) {
    try {
      const payload = tokens.decode(token);
      User.findOne({ where: { email: payload.email } })
        .then(Userdb => {
          if (Userdb) {
            res.status(201).end();
          } else {
            next(errors.invalidToken('Invalid token.'));
          }
        })
        .catch(next);
    } catch (err) {
      next(errors.invalidToken(err.message));
    }
  } else {
    next(errors.invalidToken('Token not found'));
  }
};
