require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

const articleRoutes = require('./routes/article');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/articles', articleRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);

if(process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost:27017/blog-test', { useNewUrlParser: true });
} else {
  mongoose.connect('mongodb://blog:blog123@ds123971.mlab.com:23971/blog', { useNewUrlParser: true });
}
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to mongooese...'));

app.listen(PORT, () => console.log('Listen in PORT: ' + PORT));

module.exports = app;