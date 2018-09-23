const Article = require('../models/article');

module.exports = {
  findAll(req, res) {
    Article.find({}).populate('author').populate('comments')
    .then(articles => {
      res.status(200).json({
        message: 'success get all articles data',
        articles
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },

  findById(req, res) {
    let id = req.params.id;

    Article.findOne({_id: id}).populate('author').populate('comments')
    .then(article => {
      res.status(200).json({
        message: 'success get article data',
        article
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },

  create(req, res) {
    let input = {
      title: req.body.title,
      author: req.decoded.id,
      content: req.body.content
    }

    Article.create(input)
    .then(newArticle => {
      res.status(200).json({
        message: 'success create new article',
        article: newArticle
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },

  update(req, res) {
    let articleId = req.params.id;
    let author = req.decoded.id;

    let input = {
      title: req.body.title,
      content: req.body.content,
      updatedAt: new Date()
    }

    Article.findOne({ author: author })
    .then(article => {
      if(!article) {
        res.status(500).json({
          message: 'no article created by this author'
        });  
      } else {
        Article.updateOne({ _id: articleId }, input)
        .then(affected => {
          res.status(200).json({
            message: 'success update article',
            id: article._id
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
    });
  },

  remove(req, res) {
    let articleId = req.params.id;
    let author = req.decoded.id;

    Article.findOne({ author: author })
    .then(article => {
      if(!article) {
        res.status(500).json({
          message: 'no article created by this author'
        });  
      } else {
        Article.deleteOne({ _id: articleId })
        .then(affected => {
          res.status(200).json({
            message: 'success delete article',
            id: article._id
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
    });
  }
}