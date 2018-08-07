const users = require('./controllers/user');

exports.init = app => {
  app.post('/users', users.create);
};
