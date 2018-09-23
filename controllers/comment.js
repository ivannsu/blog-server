const Comment = require('../models/comment');
const Article = require('../models/article');
const User = require('../models/user');

module.exports = {
  findAll(req, res) {
    Comment.find()
    .then(comments => {
      res.status(200).json({
        message: 'success get all comments',
        comments: comments
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    })
  },

  create(req, res) {

    User.findOne({_id: req.decoded.id})
    .then(user => {
      let articleId = req.body.articleId;
      let input = {
        user: user.name,
        userId: req.decoded.id,
        content: req.body.content
      }

      Comment.create(input)
      .then(newComment => {

        Article.updateOne(
          { _id: articleId },
          { $push: { comments: newComment._id } }
        )
        .then(affected => {
          res.status(201).json({
            message: 'success create new comment',
            comment: newComment,
            articleId: articleId
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });
        })
      })
      .catch(err => {
        res.status(500).json({
          message: err.message
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    })
  },

  update(req, res) {
    let commentId = req.params.id;
    let user = req.decoded.id;

    Comment.findOne({ _id: commentId, user: user })
    .then(comment => {

      if(!comment) {
        res.status(500).json({
          message: 'no comment created by this user'
        });
      } else {
        Comment.updateOne()
        .then(affected => {
          res.status(200).json({
            message: 'success update comment',
            id: comment._id
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });    
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    })
  },

  remove(req, res) {
    let commentId = req.params.id;
    let user = req.decoded.id;

    Comment.findOne({ _id: commentId, user: user })
    .then(comment => {

      if(!comment) {
        res.status(500).json({
          message: 'no comment created by this user'
        });
      } else {
        comment.remove()
        .then(affected => {
          res.status(200).json({
            message: 'success delete comment',
            id: comment._id
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });    
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    })
  }
}