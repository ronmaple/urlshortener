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
    let url = req.body.url;
    console.log('url', url);

    dns.lookup(url, (err, address, family) => {
      console.log('dns.lookup. address:', address, 'url', url);
        if (address !== undefined) {
          console.log('address !== undefined');
            UrlEntry
                .find({ originalUrl: url})
                .exec( (err, data) => {
                    if (err) console.log(err);

                    if (data === []) {
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
                    }
                })
        }
    });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Node.js is listening on ${port}`);
});

// 'use strict';

// const express = require('express');
// const mongo = require('mongodb');
// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// const bp = require('body-parser');
// const dns = require('dns')
// mongoose.set('debug', true);
// const cors = require('cors');

// const app = express();

// // const counter = require('./counter');

// // async problems --- redo all 

// // let count = 0; not global ?
// let results = {}

// // mount body-parser
// app.use(bp.urlencoded({extended: false}));

// // Basic Configuration 
// const port = process.env.PORT || 3000;

// /** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

// const urlSchema = new Schema({
//   id: Number,
//   originalUrl: String
// });

// const UrlEntry = mongoose.model('UrlEntry', urlSchema);

// function checkIfExists(url) {
//   console.log('checkIfExists called, url:', url);
//   console.log(typeof url);
//   UrlEntry
//     .find({ originalUrl: url })
//     .exec( function(err, data) {
//       if (err) console.error(err);
      
//       if (data === []) {
//         console.log('data does not exists: ', data);
        
//         UrlEntry.find({}, (err, data) => {
//           if (err) console.error(err);
          
//           let n = data.length;
          
//           console.log('n', n);
          
//           let entry = new UrlEntry({
//             id: n,
//             originalUrl: url
//           })
          
//           entry.save();
          
//         })
//       }
    
//     });
// }

// // function counter(url) {
// //   let n = 0;
// //   console.log('inside counter');
// //     UrlEntry
// //       .find({})
// //       .sort({id: -1})
// //       .exec( (err, data) => {
// //         if (err) console.error(err);
// //         console.log('data0 in counter', data[0]);
// //         const { id } = data[0];
// //         console.log('id', id);
// //         n = id + 1;
// //       });
// //   console.log('count in after id+1', n);
// //   return n;
// // }

// // helper functions
// const createEntry = function(url) {
//   let n = 0;
//   console.log('url in createEntry', url);
//   console.log('count [as n] in createEntry', n);
//   let exists = checkIfExists(url);
  
//   if (!exists) {
//     // n = counter(url);
//     console.log('count outside', n);
//     let entry = new UrlEntry({
//       id: n,
//       originalUrl: url
//     });
    
//     let original_url = entry.originalUrl; // change this variable name to original_url for simplicity
//     // let n = UrlEntry.length();
//     // console.log(UrlEntry)
    
//     results = {
//       original_url,
//       count: n
//     }
    
//     entry.save();
    
//     return results;

//   } else if (exists) {
//     return 'exists'
//   }
  
// }


// app.use(cors());

// /** this project needs to parse POST bodies **/
// // you should mount the body-parser here

// app.use('/public', express.static(process.cwd() + '/public'));

// app.get('/', function(req, res){
//   res.sendFile(process.cwd() + '/views/index.html');
// });


// // your first API endpoint... 
// app.get("/api/hello", function (req, res) {
//   res.json({greeting: 'hello API'});
// });

// // app.post // url -> check DNS -> check if exists in MDB-> enter / get from MDB
// app.post('/api/shorturl/new', (req, res) => {
//   console.log('req.body', req.body);
//   let url = req.body.url;
//   console.log('url', req.body.url);
  
//   dns.lookup(url, (err, address, family) => {
//     // if address exists -> perform mdb functions
//     if (address != undefined) {
//       let results = createEntry(url);
//       res.json(results);
//     }
//   });
// })


// app.listen(port, function () {
//   console.log('Node.js listening ...');
// });