const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI);

console.log(mongoose.Schema);

// module.exports = function() {
//     console.log('inside counter');
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