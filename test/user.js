const chai = require('chai'),
  User = require('../app/models').user,
  chaiHttp = require('chai-http'),
  dictum = require('dictum.js'),
  expect = chai.expect,
  token = require('../app/services/tokenGenerator'),
  server = require('../app');

chai.use(chaiHttp);

const creation = object =>
  chai
    .request(server)
    .post('/users')
    .send(object);

const postSession = object =>
  chai
    .request(server)
    .post('/users/sessions')
    .send(object);

const setToken = (tokenHeader, tokenEncode) =>
  chai
    .request(server)
    .get('/users')
    .set(tokenHeader, tokenEncode)
    .query({
      limit: 10,
      offset: 0
    });

const testUser = {
  firstName: 'Juan',
  lastName: 'Gutierrez',
  email: 'juanguti43@wolox.com.ar',
  password: 'pass12345678'
};
const testUser2 = {
  firstName: 'Martin',
  lastName: 'Sr.Picollo',
  email: 'srpicollo12@wolox.com.ar',
  password: 'gohan1234'
};

describe('User', () => {
  describe('POST /user', () => {
    const userFailName = {
      firstName: '',
      lastName: 'Gutierrez',
      email: 'juangu43@wolox.com.ar',
      password: 'pass12345678'
    };
    const userFailLastName = {
      firstName: 'Juan',
      lastName: '',
      email: 'juangu43@wolox.com.ar',
      password: 'pass12345678'
    };
    const userFailEmail = {
      firstName: 'Juan',
      lastName: 'Gutierrez',
      email: '',
      password: 'pass12345678'
    };
    const userFailPass = {
      firstName: 'Juan',
      lastName: 'Gutierrez',
      email: 'juangu43@wolox.com.ar',
      password: ''
    };
    const userPassNoNumbers = {
      firstName: 'Juan',
      lastName: 'Gutierrez',
      email: 'juangu43@wolox.com.ar',
      password: 'passwordfortesting'
    };
    const userPassNoLetters = {
      firstName: 'Juan',
      lastName: 'Gutierrez',
      email: 'juangu43@wolox.com.ar',
      password: '12345678910'
    };
    const userPassfiveCharacters = {
      firstName: 'Juan',
      lastName: 'Gutierrez',
      email: 'juangu43@wolox.com.ar',
      password: 'pass1'
    };
    const emailNotWolox = {
      firstName: 'Juan',
      lastName: 'Gutierrez',
      email: 'juangu43@hotmail.com',
      password: 'pass12345678'
    };
    const emailExists = {
      firstName: 'Juan',
      lastName: 'Gutierrez',
      email: 'juangu43@wolox.com.ar',
      password: 'pass12345678'
    };

    it('Should create a user', done => {
      creation(testUser).then(res => {
        expect(res).to.have.status(201);
        User.findOne({
          attributes: ['email'],
          where: {
            email: 'juanguti43@wolox.com.ar'
          }
        }).then(db => {
          expect(db.email).to.eql(testUser.email);
          dictum.chai(res, 'User creation');
          done();
        });
      });
    });
    it('Should not create a user without First Name', done => {
      creation(userFailName).catch(err => {
        expect(err.response).to.have.status(400);
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).to.include('firstName cannot be null or empty');
        expect(err.response.body).to.have.property('internal_code');
        expect(err.response.body.internal_code).to.be.equal('Invalid_user');
        done();
      });
    });
    it('Should not create a user without Last Name', done => {
      creation(userFailLastName).catch(err => {
        expect(err.response).to.have.status(400);
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).to.include('lastName cannot be null or empty');
        expect(err.response.body).to.have.property('internal_code');
        expect(err.response.body.internal_code).to.be.equal('Invalid_user');
        done();
      });
    });
    it('Should not create a user without email', done => {
      creation(userFailEmail).catch(err => {
        expect(err.response).to.have.status(400);
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).to.include('email cannot be null or empty');
        expect(err.response.body).to.have.property('internal_code');
        expect(err.response.body.internal_code).to.be.equal('Invalid_user');
        done();
      });
    });
    it('Should not create a user without password', done => {
      creation(userFailPass).catch(err => {
        expect(err.response).to.have.status(400);
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).to.include('password cannot be null or empty');
        expect(err.response.body).to.have.property('internal_code');
        expect(err.response.body.internal_code).to.be.equal('Invalid_user');
        done();
      });
    });
    it('Should not create a user with a only letters password', done => {
      creation(userPassNoNumbers).catch(err => {
        expect(err.response).to.have.status(400);
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).to.include(
          'Invalid password. Must be 8 alphanumeric characters or longer.'
        );
        expect(err.response.body).to.have.property('internal_code');
        expect(err.response.body.internal_code).to.be.equal('Invalid_user');
        done();
      });
    });
    it('Should not create a user with a only numbers password', done => {
      creation(userPassNoLetters).catch(err => {
        expect(err.response).to.have.status(400);
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).to.include(
          'Invalid password. Must be 8 alphanumeric characters or longer.'
        );
        expect(err.response.body).to.have.property('internal_code');
        expect(err.response.body.internal_code).to.be.equal('Invalid_user');
        done();
      });
    });
    it('Should not create a user with a password < 8 characters', done => {
      creation(userPassfiveCharacters).catch(err => {
        expect(err.response).to.have.status(400);
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).to.include(
          'Invalid password. Must be 8 alphanumeric characters or longer.'
        );
        expect(err.response.body).to.have.property('internal_code');
        expect(err.response.body.internal_code).to.be.equal('Invalid_user');
        done();
      });
    });
    it('Should not create a user with an invalid mail domain', done => {
      creation(emailNotWolox).catch(err => {
        expect(err.response).to.have.status(400);
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).to.include(
          'Email is not a valid email or not the @wolox.com.ar domain.'
        );
        expect(err.response.body).to.have.property('internal_code');
        expect(err.response.body.internal_code).to.be.equal('Invalid_user');
        done();
      });
    });
    it('Should not create a user with a email already in use', done => {
      creation(emailExists)
        .then(() => creation(emailExists))
        .catch(err => {
          expect(err.response).to.have.status(400);
          expect(err.response.body).to.have.property('message');
          expect(err.response.body.message).to.equal('This email already exists');
          expect(err.response.body).to.have.property('internal_code');
          expect(err.response.body.internal_code).to.be.equal('Request_error');
          done();
        });
    });
  });
});

describe('/users/sessions POST', () => {
  const sessionOk = {
    email: 'juanguti43@wolox.com.ar',
    password: 'pass12345678'
  };
  const failDomain = {
    email: 'juangu@hotmail.com',
    password: 'pass123456'
  };
  const failRegistered = {
    email: 'juanguti21@wolox.com.ar',
    password: 'pass12345678'
  };
  const failPassword = {
    email: 'juanguti43@wolox.com.ar',
    password: 'passwordtesting1234'
  };
  const nullPassword = {
    email: 'juanguti43@wolox.com.ar',
    password: null
  };
  const nullEmail = {
    email: null,
    password: 'pass12345678'
  };

  it('Should Sing In a user', done => {
    creation(testUser)
      .then(() => postSession(sessionOk))
      .then(res => {
        expect(res.header).to.have.property('authorization');
        expect(token.decode(res.header.authorization).email).to.equal(testUser.email);
        expect(res).to.have.status(200);
        dictum.chai(res, 'User Sing In');
        done();
      });
  });

  it('Should not sing in a user with an invalid domain', done => {
    postSession(failDomain).catch(err => {
      expect(err.response).to.have.status(400);
      expect(err.response.body).to.have.property('message');
      expect(err.response.body.message).to.include(
        'Email is not a valid email or not the @wolox.com.ar domain.'
      );
      expect(err.response.body).to.have.property('internal_code');
      expect(err.response.body.internal_code).to.be.equal('Invalid_user');
      done();
    });
  });

  it('Should not sing in a user when email is not registered or is invalid', done => {
    creation(testUser)
      .then(() => postSession(failRegistered))
      .catch(err => {
        expect(err.response).to.have.status(400);
        expect(err.response.body).to.have.property('message');
        expect(err.response.body).to.have.property('internal_code');
        expect(err.response.body.message).to.equal(`Cannot find user ${failRegistered.email} or is invalid.`);
        expect(err.response.body.internal_code).to.equal('Invalid_user');
        done();
      });
  });

  it('Should not sing in a user because password is incorrect', done => {
    creation(testUser)
      .then(() => postSession(failPassword))
      .catch(err => {
        expect(err.response).to.have.status(400);
        expect(err.response.body).to.have.property('message');
        expect(err.response.body).to.have.property('internal_code');
        expect(err.response.body.message).to.equal(`Email ${failPassword.email} or password are incorrect.`);
        expect(err.response.body.internal_code).to.equal('Invalid_user');
        done();
      });
  });

  it('Should not sing in a user with a null password', done => {
    creation(testUser)
      .then(() => postSession(nullPassword))
      .catch(err => {
        expect(err.response).to.have.status(400);
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).to.include('password cannot be null or empty');
        expect(err.response.body).to.have.property('internal_code');
        expect(err.response.body.internal_code).to.equal('Invalid_user');
        done();
      });
  });

  it('Should not sing in a user with a null email', done => {
    creation(testUser)
      .then(() => postSession(nullEmail))
      .catch(err => {
        expect(err.response).to.have.status(400);
        expect(err.response.body).to.have.property('message');
        expect(err.response.body).to.have.property('internal_code');
        expect(err.response.body.message).to.include('email cannot be null or empty');
        expect(err.response.body.internal_code).to.equal('Invalid_user');
        done();
      });
  });
  describe('/users GET', () => {
    it('Should be succesfull', done => {
      creation(testUser)
        .then(() => postSession(sessionOk))
        .then(() => setToken(token.header, token.encode({ email: 'juanguti43@wolox.com.ar' })))
        .then(res => {
          expect(token.header).to.equal('authorization');
          expect(res).to.be.a('object');
          expect(res.body).to.have.property('count');
          expect(res.body).to.have.property('rows');
          expect(res.body.count).to.be.eql(1);
          expect(res.body.rows).to.have.lengthOf(1);
          expect(res.body.rows[0]).to.have.property('firstName');
          expect(res.body.rows[0]).to.have.property('lastName');
          expect(res.body.rows[0]).to.have.property('email');
          expect(res.body.limit).to.eql(setToken.limit);
          expect(res.body.offset).to.eql(setToken.offset);
          expect(res.body.count).to.be.above(0);
          expect(res).to.have.status(200);
          dictum.chai(res, 'User list get succesfully');
          done();
        });
    });

    it('Should not get the list without a token', done => {
      chai
        .request(server)
        .get('/users')
        .query({
          limit: 10,
          offset: 0
        })
        .catch(err => {
          expect(err.response).to.have.status(401);
          expect(err.response.body).to.have.property('message');
          expect(err.response.body).to.have.property('internal_code');
          expect(err.response.body.message).to.equal('Token not found');
          expect(err.response.body.internal_code).to.equal('Invalid_token');
          done();
        });
    });

    it('Should fail because token its wrong', done => {
      chai
        .request(server)
        .get('/users')
        .set(token.header, token.encode({ email: 'test-asd123@wolox.com.ar' }))
        .query({
          limit: 10,
          offset: 0
        })
        .catch(err => {
          expect(err.response).to.have.status(401);
          expect(err.response.body).to.have.property('message');
          expect(err.response.body).to.have.property('internal_code');
          expect(err.response.body.message).to.equal('Invalid token.');
          expect(err.response.body.internal_code).to.equal('Invalid_token');
          done();
        });
    });
  });
});
