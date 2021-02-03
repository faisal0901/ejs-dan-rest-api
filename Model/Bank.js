const mongoose = require("mongoose");
const BankSchema = new mongoose.Schema({
  nameBank: {
    type: String,
    required: true,
  },
  nomorRekening: {
    type: Number,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  ImageUrl: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Bank", BankSchema);
