require('dotenv').config();

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypt = require('../helpers/crypt');

module.exports = {
  findById(req, res) {

  },

  signup(req, res) {
    let input = {
      name: req.body.name,
      email: req.body.email,
      password: crypt(req.body.password)
    }

    User.findOne({ email: input.email })
    .then(user => {
      if(!user) {

        User.create(input)
        .then(newUser => {
          res.status(201).json({
            message: 'success signup',
            user: newUser
          });    
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });    
        });

      } else {
        res.status(500).json({
          message: 'this email already registered'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },

  signin(req, res) {
    let input = {
      email: req.body.email,
      password: crypt(req.body.password)
    }

    User.findOne(input)
    .then(user => {
      if(!user) {
        res.status(500).json({
          message: 'Username or Password Wrong'
        });
      } else {
        let token = jwt.sign({ 
          id: user._id, name: user.name, email: user.email 
        }, process.env.JWT_SECRET_KEY);

        res.status(200).json({
          message: 'success sign in',
          userId: user._id,
          token
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