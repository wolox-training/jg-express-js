exports.execute = () => {
  const bcrypt = require('bcryptjs'),
    User = require('../app/models').user;

  exports.execute = () => {
    return bcrypt
      .hash('1234', 10)
      .then(hash => {
        const data = [];
        data.push(
          User.create({
            firstName: 'firstName1',
            lastName: 'lastName1',
            username: 'username1',
            email: 'email1@gmail.com',
            password: hash
          })
        );
        data.push(
          User.create({
            firstName: 'firstName2',
            lastName: 'lastName2',
            username: 'username2',
            email: 'email2@gmail.com',
            password: hash
          })
        );
        data.push(
          User.create({
            firstName: 'firstName3',
            lastName: 'lastName3',
            username: 'username3',
            email: 'email3@gmail.com',
            password: hash
          })
        );
        data.push(
          User.create({
            firstName: 'firstName4',
            lastName: 'lastName4',
            username: 'username4',
            email: 'email4@gmail.com',
            password: hash
          })
        );
        data.push(
          User.create({
            firstName: 'firstName5',
            lastName: 'lastName5',
            username: 'username5',
            email: 'email5@gmail.com',
            password: hash
          })
        );
        data.push(
          User.create({
            firstName: 'firstName6',
            lastName: 'lastName6',
            username: 'username6',
            email: 'email6@gmail.com',
            password: hash
          })
        );
        data.push(
          User.create({
            firstName: 'admin',
            lastName: 'root',
            username: 'admin1',
            email: 'admin@wolox.com.ar',
            password: 'root1234',
            isAdmin: true
          })
        );
        return Promise.all(data);
      })
      .catch(bcryptErr => {
        throw bcryptErr;
      });
  };
};
