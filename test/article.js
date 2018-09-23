require('dotenv').config();

const app = require('../app');
const Article = require('../models/article');
const User = require('../models/user');
const crypt = require('../helpers/crypt');
const jwt = require('jsonwebtoken');

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp);

let articleId;
let userId;
let token;

describe('Article', function() {

  beforeEach(function(done) {

    let seed = {
      name: 'ivan',
      email: 'ivan768@mail.com',
      password: '123'
    }

    User.create(seed)
    .then(newUser => {

      let articleSeed = {
        title: 'sample title',
        author: newUser._id,
        content: 'hello world'
      }
  
      Article.create(articleSeed)
      .then(newArticle => {
        articleId = newArticle._id;
        userId = newUser._id;

        let usertoken = jwt.sign({ 
          id: userId, name: newUser.name, email: newUser.email 
        }, process.env.JWT_SECRET_KEY);

        token = usertoken;
        done();
      })
      .catch(err => {
        console.error(err.message);
        done();
      });
    })
    .catch(err => {
      console.error(err.message);
      done();
    });
  });

  afterEach(function(done) {
    User.deleteMany({})
    .then(affected => {

      Article.deleteMany({})
      .then(affected => {
        done();
      })
      .catch(err => {
        console.error(err);
        done();
      })
    })
    .catch(err => {
      console.error(err.message);
      done();
    })
  });

  it('GET /articles/ - dapatkan semua data artikel', function(done) {  
    chai.request(app)
    .get('/articles/')
    .end(function(err, res) {
      let response = res.body;

      assert.equal(res.status, 200);
      assert.typeOf(response, 'object');
      assert.property(response, 'message');
      assert.property(response, 'articles');

      done();
    });

  });

  it('POST /articles/ - buat artikel baru', function(done) {

    chai.request(app)
    .post('/articles/')
    .type('form')
    .set('token', token)
    .send({
      title: 'sample title -2',
      author: userId,
      content: 'no coding no life :V'
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
          assert.property(response, 'article');

          done();
        }
    });
  });

  it('PUT /articles/:id - update artikel berdasarkan id artikel', function(done) {
    chai.request(app)
    .put(`/articles/${articleId}`)
    .type('form')
    .set('token', token)
    .send({
      title: 'sample title -2',
      content: 'updated: message'
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
        assert.property(response, 'id');

        done();
      }
    });
  });

  it('DELETE /articles/:id - hapus artikel berdasarkan id artikel', function(done) {
    chai.request(app)
    .put(`/articles/${articleId}`)
    .set('token', token)
    .end(function(err, res) {
      if(err) {
        console.error(err);
        done();
      } else {
        let response = res.body;

        assert.equal(res.status, 200);
        assert.typeOf(response, 'object');
        assert.property(response, 'message');
        assert.property(response, 'id');

        done();
      }
    });
  });

});