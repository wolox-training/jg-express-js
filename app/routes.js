const users = require('./controllers/user'),
  userSingIn = require('./services/singUser');

exports.init = app => {
  app.post('/users', users.createUser);
  app.post('/users/sessions', userSingIn.signIn);
};
