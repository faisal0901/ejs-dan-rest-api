const mongoose = require("mongoose");
const MemberSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },

  PhoneNumber: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Member", MemberSchema);
