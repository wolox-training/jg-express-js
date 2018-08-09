exports.validateUser = user => {
  const errorMsgs = [];
  const validMail = /([A-Za-z][0-9])|([0-9][A-Za-z])@wolox.com.ar\s*$/;
  const validPass = /([A-Za-z]+[0-9]+)|([0-9]+[A-Za-z]+)/;
  const keys = Object.keys(user);

  keys.forEach(function(element) {
    if (user[element].length <= 0) {
      errorMsgs.push(`${element} cannot be null or empty`);
    }
    if (user[element] === user.email && !user[element].match(validMail)) {
      errorMsgs.push('Email is not a valid email or not the @wolox.com.ar domain.');
    }
    if (user[element] === user.password && !user[element].match(validPass)) {
      errorMsgs.push('Invalid password. Must be 8 alphanumeric characters or longer.');
    }
  });
};
