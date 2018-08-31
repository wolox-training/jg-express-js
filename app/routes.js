const users = require('./controllers/user'),
  validToken = require('./middlewares/validationTokens');

exports.init = app => {
  app.post('/users', users.createUser);
  app.post('/users/sessions', users.signIn);
  app.get('/users', [validToken.validateToken], users.getListUsers);
};
