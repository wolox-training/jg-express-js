exports.validateUser = user => {
  const errorMsgs = [];
  const validMail = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))*@wolox.com.ar/;
  const validPass = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;

  if (user.firstName === undefined) {
    errorMsgs.push('First name cannot be null.');
  } else if (user.firstName.length <= 0) {
    errorMsgs.push('First name cannot be empty.');
  }

  if (user.lastName === undefined) {
    errorMsgs.push('Last name cannot be null.');
  } else if (user.lastName.length <= 0) {
    errorMsgs.push('Last name cannot be empty.');
  }

  if (user.email === undefined) {
    errorMsgs.push('Email cannot be null.');
  } else if (user.email.length <= 0) {
    errorMsgs.push('Email cannot be empty and cannot be less than 8 characters');
  } else {
    if (!user.email.match(validMail)) {
      errorMsgs.push('Email is not a valid email and/or not in the @wolox.com.ar domain.');
    }
  }
  if (user.password === undefined) {
    errorMsgs.push('Password cannot be null.');
  } else if (!user.email.match(validPass) || user.password.lenght < 8) {
    errorMsgs.push('Invalid password. Must be 8 alphanumeric characters or longer.');
  }
};
