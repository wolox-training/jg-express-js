const users = require('./controllers/users');
const errors = require('./middlewares/errors');

exports.init = app => {
  app.post('/signup', users.create);
};
