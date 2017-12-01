var express = require('express');
var router = express.Router();

var expressValidator = require('express-validator');

// Bring Article Model
var Article = require('../models/article');

/* GET users listing. */
router.get('/', checkLogin, function(req, res, next) {
  Article.find({}, function(err, articles) {
    if(err) {
      console.log(err);
    } else {
      res.render('articles/index', {
        title: 'Article List',
        articles:articles
      });    
    }
  });
});


router.get('/create', function(req, res) {
  res.render('articles/create', {title: 'Create Article'});
});

router.post('/create', function(req, res) {
  var title = req.body.title;
  var content = req.body.content;
  var author = req.body.author;

  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('content', 'Content is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();

  var errors = req.validationErrors();

  if(errors) {
    res.render('articles/create', {errors:errors});
  } else {
    var newArticle = new Article({
      title:title,
      content:content,
      author:author,
    });
   
    newArticle.save(function(err) {
      if(err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Create success');
        res.redirect('/articles');
      }
    });
  }
});

// Load Edit Form 
router.get('/edit/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if (err) {
      req.flash('danger', 'Article not found');
      res.redirect('articles');
    } else {
      res.render('articles/edit', {
        title: 'Edit Article',
        article:article
      })  
    }
  })
});

router.post('/edit/:id', function(req, res) {
  let article = {};
  article._id = req.params.id;
  article.title = req.body.title;
  article.content = req.body.content;
  article.author = req.body.author;

  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('content', 'Content is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();

  var errors = req.validationErrors();

  if(errors) {
    res.render('articles/edit', {errors:errors, article:article});
  } else {

    let query = {_id:req.params.id};
   
    Article.update(query, article, function(err) {
      if(err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Update success');
        res.redirect('/articles');
      }
    });
  }
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
