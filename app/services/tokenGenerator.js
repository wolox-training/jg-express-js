const jwt = require('jwt-simple'),
  config = require('./../../config');

const secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

exports.header = config.common.session.header_name;
exports.encode = payload => jwt.encode(payload, secret);
exports.decode = token => jwt.decode(token, secret);
