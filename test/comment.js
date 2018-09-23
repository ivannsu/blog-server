require('dotenv').config();

const app = require('../app');
const Article = require('../models/article');
const User = require('../models/user');
const Comment = require('../models/comment');
const crypt = require('../helpers/crypt');
const jwt = require('jsonwebtoken');

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp);

let articleId;
let userId;
let commentId;
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

        let commentSeed = {
          user: userId,
          content: 'nice post man!'
        }

        Comment.create(commentSeed)
        .then(newComment => {
          commentId = newComment._id;
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
    })
    .catch(err => {
      console.error(err.message);
      done();
    });
  });

  afterEach(function(done) {
    User.deleteMany({})
    .then(affectedUser => {

      Article.deleteMany({})
      .then(affectedArticle => {
        
        Comment.deleteMany({})
        .then(affectedComment => {
          done();
        })
        .catch(err => {
          console.error(err);  
          done();
        })
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

  it('GET /comments/ - dapatkan semua data komentar', function(done) {  
    chai.request(app)
    .get('/comments/')
    .end(function(err, res) {
      let response = res.body;

      assert.equal(res.status, 200);
      assert.typeOf(response, 'object');
      assert.property(response, 'message');
      assert.property(response, 'comments');

      done();
    });

  });

  it('POST /comments/ - buat komentar baru', function(done) {

    chai.request(app)
    .post('/comments/')
    .type('form')
    .set('token', token)
    .send({
      user: userId,
      content: 'no comment pak eko'
    })
    .end(function(err, res) {
      if(err) {
        console.error(err);
        done();
      } else {
        let response = res.body;

        // console.log(response, '<========== CREATED COMMENT');

        assert.equal(res.status, 201);
        assert.typeOf(response, 'object');
        assert.property(response, 'message');
        assert.property(response, 'comment');

        done();
        }
    });
  });

  it('PUT /comments/:id - update komentar berdasarkan id komentar', function(done) {

    chai.request(app)
    .put(`/comments/${commentId}`)
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

  it('DELETE /comments/:id - hapus comment berdasarkan id comment', function(done) {

    chai.request(app)
    .put(`/comments/${commentId}`)
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

