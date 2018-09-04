const chai = require('chai'),
  User = require('../app/models').user,
  chaiHttp = require('chai-http'),
  dictum = require('dictum.js'),
  expect = chai.expect,
  token = require('../app/services/tokenGenerator'),
  dataCreation = require('../scripts/dataCreation'),
  server = require('../app');

chai.use(chaiHttp);
dataCreation.execute();

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

const generateToken = (tokenHeader, tokenEncode) =>
  chai
    .request(server)
    .get('/users')
    .set(tokenHeader, tokenEncode)
    .query({
      limit: 5,
      page: 0
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
        .then(() => generateToken(token.header, token.encode({ email: 'juanguti43@wolox.com.ar' })))
        .then(res => {
          expect(token.header).to.equal('authorization');
          expect(res).to.be.a('object');
          expect(res.body).to.have.property('count');
          expect(res.body).to.have.property('rows');
          expect(res.body.count).to.eql(8);
          expect(res.body.rows.length).to.eql(5);
          expect(res.body.count).to.be.above(0);
          expect(res).to.have.status(200);
          dictum.chai(res, 'User list get succesfully');
          chai
            .request(server)
            .get('/users')
            .set(token.header, token.encode({ email: 'email1@gmail.com' }))
            .query({
              limit: 3,
              page: 1
            })
            .then(res2 => {
              expect(res).to.have.status(200);
              expect(res2.body.rows.length).to.eql(3);
              expect(res2.body.count).to.eql(8);
              done();
            });
        });
    });

    it('Should not get the list without a token', done => {
      chai
        .request(server)
        .get('/users')
        .query({
          limit: 5,
          page: 0
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
          limit: 5,
          page: 0
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

    describe('/admin/users POST', () => {
      it('Should fail because user is not an admin', done => {
        creation(testUser).then(user => {
          chai
            .request(server)
            .post('/users/admins')
            .set(token.header, token.encode({ email: 'juanguti43@wolox.com.ar' }))
            .send({
              firstName: 'name name',
              lastName: 'last last',
              password: 'pass12345678',
              email: 'email@email.com'
            })
            .catch(err => {
              expect(err.response).to.have.status(401);
              expect(err.response.body).to.have.property('message');
              expect(err.response.body).to.have.property('internal_code');
              expect(err.response.body.message).to.equal(
                `User ${testUser.email} do not have the required privileges`
              );
              expect(err.response.body.internal_code).to.equal('User_unauthorized');
              done();
            });
        });
      });

      it('Should fail because arguments are not valid', done => {
        chai
          .request(server)
          .post('/users/admins')
          .set(token.header, token.encode({ email: 'admin@wolox.com.ar' }))
          .send({
            firstName: '',
            lastName: '',
            password: '123',
            email: 'juanguti43@hotmail.com'
          })
          .catch(err => {
            expect(err.response).to.have.status(400);
            expect(err.response.body).to.have.property('message');
            expect(err.response.body).to.have.property('internal_code');
            expect(err.response.body.message).to.include(
              'firstName cannot be null or empty',
              'lastName cannot be null or empty',
              'Email is not a valid email or not the @wolox.com.ar domain.',
              'Invalid password. Must be 8 alphanumeric characters or longer.'
            );
            expect(err.response.body.internal_code).to.equal('Invalid_user');
            done();
          });
      });

      it('Should create a new admin', done => {
        chai
          .request(server)
          .post('/users/admins')
          .set(token.header, token.encode({ email: 'admin@wolox.com.ar' }))
          .send({
            firstName: 'Gohan',
            lastName: 'testing',
            password: 'pass1234',
            email: 'gohanss2@wolox.com.ar'
          })
          .then(res => {
            expect(res).to.have.status(201);
            User.findOneUserWhere({ email: 'gohanss2@wolox.com.ar' }).then(UserDb => {
              expect(UserDb.firstName).to.eql('Gohan');
              expect(UserDb.lastName).to.eql('testing');
              expect(UserDb.email).to.eql('gohanss2@wolox.com.ar');
              expect(UserDb.isAdmin).to.eql(true);
              dictum.chai(res);
              done();
            });
          });
      });
      it('Should update a new user like an admin', done => {
        creation(testUser2).then(() => {
          chai
            .request(server)
            .post('/users/admins')
            .set(token.header, token.encode({ email: 'admin@wolox.com.ar' }))
            .send({
              firstName: 'Martin',
              lastName: 'Sr.Picollo',
              email: 'srpicollo12@wolox.com.ar',
              password: 'gohan1234'
            })
            .then(res => {
              expect(res).to.have.status(201);
              User.findOneUserWhere({ email: 'srpicollo12@wolox.com.ar' }).then(UserDb => {
                expect(UserDb.firstName).to.eql('Martin');
                expect(UserDb.lastName).to.eql('Sr.Picollo');
                expect(UserDb.email).to.eql('srpicollo12@wolox.com.ar');
                expect(UserDb.isAdmin).to.eql(true);
                done();
              });
            });
        });
      });
      describe('/albums GET', () => {
        it('Should be succesfull', done => {
          creation(testUser)
            .then(() => generateToken(token.header, token.encode({ email: 'juanguti43@wolox.com.ar' })))
            .then(res => {
              expect(token.header).to.equal('authorization');
              expect(res).to.be.a('object');
              expect(res.body).to.have.property('count');
              expect(res.body).to.have.property('rows');
              expect(res.body.rows).to.be.an('array');
              expect(res.body.count).to.be.above(0);
              expect(res).to.have.status(200);
              dictum.chai(res, 'Albums list get succesfully');
              done();
            });
        });
      });
    });
  });
});
