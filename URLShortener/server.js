// init project
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const shortUrl = require('./model/shortUrl');
var MONGODB_URI = process.env.MONGODB_URI;
app.use(bodyParser.json());
app.use(cors());

//Connect to database
mongoose.connect(MONGODB_URI)

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

//create database entry
app.get("/new/:longUrl(*)", (req, res, next) => {
  var longUrl = req.params.longUrl;  
  
  //Regex for URL
  var expression = /[-a-zA-Z0-9@:%_\+,~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+,~#?&//=]*)?/gi;
  var regex = expression;
  if (regex.test(longUrl)==true) {
    var short = Math.floor(Math.random()*100000).toString();
    var data = new shortUrl({
      originalURL: longUrl,
      shorterURL: short  
    });    
    data.save(err=>{
      if(err){
        return res.send('error saving to database')
      }
    });    
    return res.json(data);    
  } else {
    var data = new shortUrl({
      originalURL: "Does Not Match",
      shorterURL: 'Invalid URL'     
    });
    return res.json(data);
  }  
});


//Query database and forward to original URL
app.get('/:forwardUrl', (req, res, next) => {
  var {forwardUrl} = req.params;  
  shortUrl.findOne({"shorterURL": forwardUrl}, (err, data)=>{
    if(data == null) return res.send('Error reading database');
    var re = new RegExp("^(http||https)://", "i");
    var strToCheck = data.originalURL;
    if(re.test(strToCheck)){
      res.redirect(301, data.originalURL);
    } else {
      res.redirect(301, "http://" + data.originalURL);
    }
    });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
