exports.validateUser = object => {
  const errorMsgs = [];
  const validMail = /@wolox.com.ar\s*$/;
  const validPass = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;
  Object.keys(object).forEach(key => {
    if (!object[key]) {
      errorMsgs.push(`${key} cannot be null or empty`);
    }
  });

  if (!object.email.match(validMail) && errorMsgs <= 0) {
    errorMsgs.push('Email is not a valid email or not the @wolox.com.ar domain.');
  }
  if (!object.password.match(validPass) && errorMsgs <= 0) {
    errorMsgs.push('Invalid password. Must be 8 alphanumeric characters or longer.');
  }
  return errorMsgs;
};
