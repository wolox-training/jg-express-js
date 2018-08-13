exports.validateUser = object => {
  const errorMsgs = [],
    validMail = /([A-Za-z][0-9])|([0-9][A-Za-z])@wolox.com.ar\s*$/,
    validPass = /([A-Za-z]+[0-9]+)|([0-9]+[A-Za-z]+)/;
  Object.keys(object).forEach(key => {
    if (!object[key]) {
      errorMsgs.push(`${key} cannot be null or empty`);
    }
  });
  if (!object.email.match(validMail)) {
    errorMsgs.push('Email is not a valid email or not the @wolox.com.ar domain.');
  }
  if (!object.password.match(validPass)) {
    errorMsgs.push('Invalid password. Must be 8 alphanumeric characters or longer.');
  }
};
