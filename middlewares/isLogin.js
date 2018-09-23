require('dotenv').config();

const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.headers.token;

  if(!token) {
    res.status(401).json({
      message: 'invalid token'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    User.findOne({ _id: decoded.id, email: decoded.email })
    .then(user => {
      if(!user) {
        res.status(401).json({
          message: 'invalid token'
        });  
      } else {
        req.decoded = decoded;
        next();
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  });
}