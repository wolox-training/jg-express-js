const users = require('./controllers/user'),
  albums = require('./controllers/albums'),
  validToken = require('./middlewares/validationTokens');

exports.init = app => {
  app.post('/users', users.createUser);
  app.post('/users/sessions', users.signIn);
  app.get('/users', [validToken.validateToken], users.getListUsers);
  app.post('/users/admins', [validToken.validateToken, validToken.validateAdmin], users.newAdmin);
  app.get('/albums', [validToken.validateToken], albums.albumList);
  app.post('/albums/:id', [validToken.validateToken], albums.purchaseAlbum);
};
