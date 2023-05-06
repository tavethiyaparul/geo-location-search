const mongoose = require("mongoose");

const conn = mongoose.connect(process.env.MONGOURL, {}).then(() => {
  console.log("Connect database");
});

module.exports = conn;
