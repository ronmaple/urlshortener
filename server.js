'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bp = require('body-parser');
const dns = require('dns')
mongoose.set('debug', true);
const cors = require('cors');

const app = express();

const counter = require('./counter');

// let count = 0; not global ?
let results = {}

// mount body-parser
app.use(bp.urlencoded({extended: false}));

// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI);

const urlSchema = new Schema({
  id: Number,
  originalUrl: String
});

const UrlEntry = mongoose.model('UrlEntry', urlSchema);

function checkIfExists(url) {
  console.log('checkIfExists called, url:', url);
  console.log(typeof url);
  UrlEntry
    .find({ originalUrl: 'www.reddit.com' })
    .exec( function(err, data) {
      console.log('url inside', url);
      if (err) console.error(err);
      console.log('checkIfExists', data);
    
      // if empty array ==> doesn't exist, return false
      if (data === []) {
        return false;
      } else { 
        return true; 
      }
    });
}

// function counter(url) {
//   console.log('inside counter');
//     UrlEntry
//       .find({})
//       .sort({id: -1})
//       .exec( (err, data) => {
//         if (err) console.error(err);
//         const { id } = data[0];
//         count = id + 1;
//       });
//   console.log('count in after id+1', count);
//   return count;
// }
// helper functions
const createEntry = function(url) {
  
  console.log('url in createEntry', url);
  console.log('count in createEntry', count);
  let exists = checkIfExists(url);
  
  if (!exists) {
    counter(url);
    console.log('count outside', count);
    let entry = new UrlEntry({
      id: count,
      originalUrl: url
    });
    
    let original_url = entry.originalUrl;
    let num = entry.id;
    
    results = {
      original_url,
      count: num
    }
    
    entry.save();
    
    return results;

  } else if (exists) {
    
  }
  
}


app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// app.post // url -> check DNS -> check if exists in MDB-> enter / get from MDB
app.post('/api/shorturl/new', (req, res) => {
  console.log('req.body', req.body);
  let url = req.body.url;
  console.log('url', req.body.url);
  
  dns.lookup(url, (err, address, family) => {
    // if address exists -> perform mdb functions
    if (address != undefined) {
      let results = createEntry(url);
      res.json(results);
    }
  });
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});