const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  content:{
    type: String,
    required: true
  }
});

const Article = module.exports = mongoose.model('Article', ArticleSchema);