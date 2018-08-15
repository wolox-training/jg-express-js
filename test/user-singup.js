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
        .catch(res => {
          expect(userFailName).to.be.a('object');
          expect(userFailName)
            .to.have.property('firstName')
            .that.is.a('string')
            .that.have.lengthOf.above(0);
          dictum.chai(res, 'User fail with no-name');
          done();
        })
        .catch(done);
    });
    it('Should not create a user without Last Name', done => {
      chai
        .request(server)
        .post('/users')
        .send(userFailLastName)
        .catch(res => {
          expect(userFailLastName).to.be.a('object');
          expect(userFailLastName)
            .to.have.property('lastName')
            .that.is.a('string')
            .that.have.lengthOf.above(0);
          dictum.chai(res, 'User fail with no-lastname');
          done();
        })
        .catch(done);
    });
    it('Should not create a user without email', done => {
      chai
        .request(server)
        .post('/users')
        .send(userFailEmail)
        .catch(res => {
          expect(userFailEmail).to.be.a('object');
          expect(userFailEmail)
            .to.have.property('email')
            .that.is.a('string')
            .that.have.lengthOf.above(0);
          dictum.chai(res, 'User fail with no-email');
          done();
        })
        .catch(done);
    });
    it('Should not create a user without password', done => {
      chai
        .request(server)
        .post('/users')
        .send(userFailPass)
        .catch(res => {
          expect(userFailPass).to.be.a('object');
          expect(userFailPass)
            .to.have.property('password')
            .that.is.a('string')
            .that.have.lengthOf.above(0);
          dictum.chai(res, 'User fail with no-password');
          done();
        })
        .catch(done);
    });
    it('Should not create a user with a only letters password', done => {
      chai
        .request(server)
        .post('/users')
        .send(userPassNoNumbers)
        .catch(res => {
          expect(userPassNoNumbers).to.be.a('object');
          expect(userPassNoNumbers).to.have.property('password');
          expect(userPassNoNumbers)
            .to.have.property('password')
            .that.match(/([A-Za-z]+[0-9]+)|([0-9]+[A-Za-z]+)/);
          dictum.chai(res, 'User fail with no-numbers');
          done();
        })
        .catch(done);
    });
    it('Should not create a user with a only numbers password', done => {
      chai
        .request(server)
        .post('/users')
        .send(userPassNoLetters)
        .catch(res => {
          expect(userPassNoLetters).to.be.a('object');
          expect(userPassNoLetters).to.have.property('password');
          expect(userPassNoLetters)
            .to.have.property('password')
            .that.match(/([A-Za-z]+[0-9]+)|([0-9]+[A-Za-z]+)/);
          dictum.chai(res, 'User fail with no-letters');
          done();
        })
        .catch(done);
    });
    it('Should not create a user with a password < 8 characters', done => {
      chai
        .request(server)
        .post('/users')
        .send(userPassfiveCharacters)
        .then(res => {
          expect(userPassfiveCharacters).to.be.a('object');
          expect(userPassfiveCharacters).to.have.property('password');
          expect(userPassfiveCharacters)
            .to.have.property('password')
            .that.have.lengthOf(8);
          dictum.chai(res, 'User fail with < 8 characters');
          done();
        })
        .catch(done);
    });
  });
});
