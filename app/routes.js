const users = require('./controllers/user');

exports.init = app => {
  app.post('/users', users.createUser);
  app.post('/users/sessions', users.signIn);
};
