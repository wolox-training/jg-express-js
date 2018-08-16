const chai = require('chai'),
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
      email: 'juangu@wolox.com.ar',
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
    it('Should create a user', done => {
      chai
        .request(server)
        .post('/users')
        .send(testUser)
        .then(res => {
          expect(res).to.have.status(201);
          expect(testUser).to.be.a('object');
          expect(testUser)
            .to.have.property('firstName')
            .that.is.a('string')
            .that.have.lengthOf.above(0);
          expect(testUser).to.have.property('lastName');
          expect(testUser).to.have.property('email');
          expect(testUser).to.have.property('password');
          dictum.chai(res, 'User creation');
          done();
        });
    });
    it('Should not create a user without First Name', done => {
      chai
        .request(server)
        .post('/users')
        .send(userFailName)
        .catch(err => {
          expect(err.response).to.have.status(400);
          expect(err.response.body).to.have.property('message');
          expect(err.response.body.message).to.include('firstName cannot be null or empty');
          expect(err.response.body).to.have.property('internal_code');
          expect(err.response.body.internal_code).to.be.equal('Invalid_user');
          dictum.chai(err.response, 'User fail with no-name');
          done();
        });
    });
    it('Should not create a user without Last Name', done => {
      chai
        .request(server)
        .post('/users')
        .send(userFailLastName)
        .catch(err => {
          expect(err.response).to.have.status(400);
          expect(err.response.body).to.have.property('message');
          expect(err.response.body.message).to.include('lastName cannot be null or empty');
          expect(err.response.body).to.have.property('internal_code');
          expect(err.response.body.internal_code).to.be.equal('Invalid_user');
          dictum.chai(err.response, 'User fail with no-lastname');
          done();
        })
        .catch(done);
    });
    it('Should not create a user without email', done => {
      chai
        .request(server)
        .post('/users')
        .send(userFailEmail)
        .catch(err => {
          expect(err.response).to.have.status(400);
          expect(err.response.body).to.have.property('message');
          expect(err.response.body.message).to.include('email cannot be null or empty');
          expect(err.response.body).to.have.property('internal_code');
          expect(err.response.body.internal_code).to.be.equal('Invalid_user');
          dictum.chai(err.response, 'User fail with no-email');
          done();
        })
        .catch(done);
    });
    it('Should not create a user without password', done => {
      chai
        .request(server)
        .post('/users')
        .send(userFailPass)
        .catch(err => {
          expect(err.response).to.have.status(400);
          expect(err.response.body).to.have.property('message');
          expect(err.response.body.message).to.include('password cannot be null or empty');
          expect(err.response.body).to.have.property('internal_code');
          expect(err.response.body.internal_code).to.be.equal('Invalid_user');
          dictum.chai(err.response, 'User fail with no-password');
          done();
        })
        .catch(done);
    });
    it('Should not create a user with a only letters password', done => {
      chai
        .request(server)
        .post('/users')
        .send(userPassNoNumbers)
        .catch(err => {
          expect(err.response).to.have.status(400);
          expect(err.response.body).to.have.property('message');
          expect(err.response.body.message).to.include(
            'Invalid password. Must be 8 alphanumeric characters or longer.'
          );
          expect(err.response.body).to.have.property('internal_code');
          expect(err.response.body.internal_code).to.be.equal('Invalid_user');
          dictum.chai(err.response, 'User fail with no-numbers');
          done();
        })
        .catch(done);
    });
    it('Should not create a user with a only numbers password', done => {
      chai
        .request(server)
        .post('/users')
        .send(userPassNoLetters)
        .catch(err => {
          expect(err.response).to.have.status(400);
          expect(err.response.body).to.have.property('message');
          expect(err.response.body.message).to.include(
            'Invalid password. Must be 8 alphanumeric characters or longer.'
          );
          expect(err.response.body).to.have.property('internal_code');
          expect(err.response.body.internal_code).to.be.equal('Invalid_user');
          dictum.chai(err.response, 'User fail with no-letters');
          done();
        })
        .catch(done);
    });
    it('Should not create a user with a password < 8 characters', done => {
      chai
        .request(server)
        .post('/users')
        .send(userPassfiveCharacters)
        .catch(err => {
          expect(err.response).to.have.status(400);
          expect(err.response.body).to.have.property('message');
          expect(err.response.body.message).to.include(
            'Invalid password. Must be 8 alphanumeric characters or longer.'
          );
          expect(err.response.body).to.have.property('internal_code');
          expect(err.response.body.internal_code).to.be.equal('Invalid_user');
          dictum.chai(err.response, 'User fail with < 8 characters');
          done();
        })
        .catch(done);
    });
  });
});
