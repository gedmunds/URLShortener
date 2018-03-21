//Template for shortURL
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  
  originalURL: String,
  shorterURL: String
  
}, {timestamps: true});

const ModelClass = mongoose.model('shortUrl', urlSchema);

module.exports = ModelClass;