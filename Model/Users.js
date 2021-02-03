const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: Number,
    required: true,
  },
});
UsersSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});
module.exports = mongoose.model("Users", BankSchema);
