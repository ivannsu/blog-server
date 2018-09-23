const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: {
    type: String
  },
  author: {
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  content: {
    type: String
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, {
  timestamps: true
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;