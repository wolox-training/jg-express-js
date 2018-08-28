const users = require('./controllers/user'),
  validToken = require('./middlewares/validationTokens'),
  userSingIn = require('./controllers/singUser');

exports.init = app => {
  app.post('/users', users.createUser);
  app.post('/users/sessions', userSingIn.signIn);
  app.get('/users', [validToken.validateToken], users.getListUsers);
};
