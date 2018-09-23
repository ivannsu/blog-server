const app = require('../app');
const User = require('../models/user');
const crypt = require('../helpers/crypt');

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp);

describe('User', function() {
  beforeEach(function(done) {
    let seed = {
      name: 'ivan',
      email: 'ivan@mail.com',
      password: crypt('123')
    }

    User.create(seed)
    .then(newUser => {
      done();
    })
    .catch(err => {
      console.error(err.message);
      done();
    });
  });

  afterEach(function(done) {
    User.deleteMany({})
    .then(affected => {
      done();
    })
    .catch(err => {
      console.error(err.message);
      done();
    })
  });

  it('POST /users/signup - should return new object user', function(done) {

    chai.request(app)
    .post('/users/signup')
    .type('form')
    .send({
      name: 'ivan',
      email: 'ivan123@mail.com',
      password: '123'
    })
    .end(function(err, res) {

      if(err) {
        console.error(err);
        done();
      } else {
        let response = res.body;

        assert.equal(res.status, 201);
        assert.typeOf(response, 'object');
        assert.property(response, 'message');
        assert.property(response, 'user');
        assert.property(response.user, 'name');
        assert.property(response.user, 'email');
        assert.property(response.user, 'password');
        done();
      }
    });
  });

  it('POST /users/signin - ', function(done) {
    chai.request(app)
    .post('/users/signin')
    .type('form')
    .send({
      email: 'ivan@mail.com',
      password: '123'
    })
    .end(function(err, res) {

      if(err) {
        console.error(err);
        done();
      } else {
        let response = res.body;

        assert.equal(res.status, 200);
        assert.typeOf(response, 'object');
        assert.property(response, 'message');
        assert.property(response, 'token');
        done();
      }
    });
  });
})