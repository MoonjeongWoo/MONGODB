const mongoose = require("mongoose");

const TempSchema = new mongoose.Schema({
  name: String,
  phone: String,
  temperature: Number,
});

const model = mongoose.model("Temp", TempSchema);

module.exports = model;
