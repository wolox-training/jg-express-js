const errors = require('../errors');
const user = require('../models/user');
const pg = require('pg');
const logger = require('../logger');

const mailValid = mail => {
  const valid = /^[a-z][a-z0-9_]*@wolox.com.ar/; // String with characters from a - z and alphanumeric with "@wolox.com.ar" ending
  return valid.test(mail);
};

const mailUniq = mail => {
  let valid = false;
  if (mail !== user.email) {
    valid = true;
  }
  return valid;
};

const correctPass = password => {
  const valid = /^[a-z][a-z0-9_]{8,}$/; // String same as valid mail, but with a 8 characters restrict
  return valid.test(password);
};

const connectionString = 'postgres://localhost/8000';

function onConnect(err, client, done) {
  if (err) {
    logger.log.error(err);
    process.exit(1);
  }
  client.end();
}

pg.connect(connectionString, onConnect); // Connecting to DB to verificate error

exports.handle = (req, next) => {
  if (!mailValid(req.user.email)) {
    next(errors.defaultError('Not a valid mail'));
    return;
  }

  if (!mailUniq(req.user.email)) {
    next(errors.defaultError('Email exists'));
    return;
  }

  if (!correctPass(req.user.password)) {
    next(errors.defaultError('Wrong password'));
    return;
  }

  next();
};
