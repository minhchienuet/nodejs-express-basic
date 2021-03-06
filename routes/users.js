var express = require('express');
var router = express.Router();

var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');
var passport = require('passport');
// Bring User Model
var User = require('../models/user');

/* GET users listing. */
router.get('/', checkLogin, function(req, res, next) {
  User.find({}, function(err, users) {
    if(err) {
      console.log(err);
    } else {
      console.log(users);
      res.render('users/index', {
        title: 'User List',
        users:users
      });    
    }
  });
});


router.get('/register', function(req, res) {
  res.render('users/register');
});

router.post('/register', function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password_confirm = req.body.password_confirm;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password_confirm', 'Password is not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors) {
    // errors.map(m => {
    //   req.flash('errors', m.msg);
    // });

    res.render('users/register', {errors:errors});
  } else {
    var newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err) {
          if(err) {
            console.log(err);
            return;
          } else {
            req.flash('success', 'You are now registered and can login');
            res.redirect('/users/login/');
          }
        })
      });
    })
  }
});


router.get('/login', function(req, res) {
  res.render('users/login');
});


router.post('/login', function(req, res, next) {
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true 
  })(req, res, next);
});


router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

function checkLogin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please Login');
    res.redirect('users/login');
  }
}

module.exports = router;
