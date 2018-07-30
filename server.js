'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bp = require('body-parser');
const dns = require('dns')
const cors = require('cors');
const app = express();
const { Schema } = mongoose;

app.use(bp.urlencoded({extended: false}));
app.use(cors());

mongoose.set('debug', true);
mongoose.connect(process.env.MONGOLAB_URI);

const urlSchema = new Schema({
  id: Number,
  originalUrl: String
});

const UrlEntry = mongoose.model('UrlEntry', urlSchema);

app.use('/public', express.static(process.cwd() + '/public'));

app.get("/api/hello", (req, res) => res.json({ greeting: 'hello API' }) );

app.post("/api/shorturl/new", (req, res) => {
  let postURL = req.body.url;
  console.log('posturl', postURL);
  
  let splitHTTPS = postURL.split('https://');
  let url;
  
  console.log(splitHTTPS);
  if (splitHTTPS.length > 0) {
    url = splitHTTPS[1];
  } else {
    url = postURL;
  }
  
  console.log('url post slice', url);
  
  
  dns.lookup(url, (err, address, family) => {
    console.log('dns.lookup. address:', address, 'url', url);
      if (address !== undefined) {
        console.log('address !== undefined');
          UrlEntry
              .find({ originalUrl: url})
              .exec( (err, data) => {

                  if (err) console.log(err);

                  if (data.length == 0) {
                      console.log('data not in db', data);

                      UrlEntry.find({}, (err, data) => {
                          if (err) console.log(err);

                          let entry = new UrlEntry({
                              id: data.length,
                              originalUrl: url
                          });

                          entry.save();
                          res.json({
                              original_url: entry.originalUrl,
                              count: entry.id
                          })
                      })
                  } else {
                    console.log('data in db', data);
                    UrlEntry
                      .find({ originalUrl: url})
                      .exec((err, data) => {
                        if (err) console.log(err);

                        res.json({
                          original_url: data[0].originalUrl,
                          count: data[0].id
                        })
                      })
                  }
              })
      }
  });
})

app.get('/api/shorturl/new/:count', (req, res) => {
  let count = req.params.count;
  console.log(typeof count);
  UrlEntry.find({ id: parseInt(count) }, (err, data) => {
    if (err) console.log(err);
    console.log('data', data);
    let url = data[0].originalUrl;
    console.log('url', url);
    
    res.redirect(`https://${url}`);
  })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Node.js is listening on ${port}`);
});