const chai = require('chai'),
  User = require('../app/models').user,
  chaiHttp = require('chai-http'),
  dictum = require('dictum.js'),
  expect = chai.expect,
  server = require('../app');

chai.use(chaiHttp);

describe('User', () => {
  describe('POST /user', () => {
    const testUser = {
      firstName: 'Juan',
      lastName: 'Gutierrez',
      email: 'juanguti43@wolox.com.ar',
      password: 'pass12345678'
    };
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
    const creation = object =>
      chai
        .request(server)
        .post('/users')
        .send(object);

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
