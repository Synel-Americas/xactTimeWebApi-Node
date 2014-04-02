
/*
 * GET clocks listing.
 */
var mongoose = require("mongoose");
var clockSchema = new mongoose.Schema({
        epoch: { type: String, required: true }
});

var ClockModel = mongoose.model('Clock', clockSchema);

/*
 * Read a list of clocks
 */
app.get('/syn/clock', function(req, res) {
  return ClockModel.find(function (err, clocks) {
   if(!err) {
      var epoch = Date.now();
      return res.send("{\"epoch\":"+epoch+"}");
   } else {
      return console.log(err);
   }
 });
});

/*
 *  Create a single clock
 */
app.post('/syn/clocks', function(req, res) {
  var clock;
  console.log("POST: ");
  console.log(req.body);
  clock = new ClockModel({
    epoch: req.body.epoch,
  });
  clock.save(function (err) {
     if (!err) {
       return console.log("created new clock");
     } else {
       return console.log(err);
     }
   });
   return res.send(clock);
});
