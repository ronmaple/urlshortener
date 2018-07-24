'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bp = require('body-parser');
const dns = require('dns')

const cors = require('cors');

const app = express();

let count = 0;

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

// helper functions
const createEntry = function(url) {
  console.log('url in createEntry', url);
  let newEntry = new UrlEntry({
    id: count,
    originalUrl: url
  })
  count++;
  newEntry.save();
}

// find latest id, and append it to counter
// keep track of count for mongodb shortener
const counter = function() {
  // let count = UrlEntry.find().sort({_id:-1});
  
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
      createEntry(url);
      // counter();
    }
  });
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});