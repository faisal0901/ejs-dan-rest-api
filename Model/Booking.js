const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const itemSchema = new mongoose.Schema({
  BookingStartDate: {
    type: Date,
    required: true,
  },
  BookingEndDate: {
    type: Date,
    required: true,
  },

  itemId: [
    {
      _id: {
        type: ObjectId,
        ref: "Item",
      },
      price: {
        type: Number,
        require: true,
      },
      night: {
        type: Number,
        require: true,
      },
    },
  ],
  memberId: [
    {
      type: ObjectId,
      ref: "Member",
    },
  ],
  bankId: [
    {
      type: ObjectId,
      ref: "Bank",
    },
  ],
  proofPayment: {
    type: String,
    required: true,
  },
  bankFrom: {
    type: String,
    required: true,
  },
  accountHolder: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("item", itemSchema);
