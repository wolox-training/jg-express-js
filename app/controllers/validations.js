const checkFields = object => {
  const errorField = [];
  Object.keys(object).forEach(key => {
    if (!object[key]) {
      errorField.push(`${key} cannot be null or empty`);
    }
  });
  return errorField;
};
exports.validateUser = object => {
  const check = checkFields(object);
  const validMail = /@wolox.com.ar\s*$/,
    validPass = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;
  let errorMsgs = [];
  if (check) {
    errorMsgs = check;
  }
  if (!object.email.match(validMail) && errorMsgs <= 0) {
    errorMsgs.push('Email is not a valid email or not the @wolox.com.ar domain.');
  }
  if (!object.password.match(validPass) && errorMsgs <= 0) {
    errorMsgs.push('Invalid password. Must be 8 alphanumeric characters or longer.');
  }
  return errorMsgs;
};
