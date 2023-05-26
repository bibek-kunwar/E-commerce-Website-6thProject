const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name must be provided"],
    },
    lastname: {
      type: String,
      required: [true, "Last Name must be provided"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "products",
    },
    payment: {
      type: String,
      default: "Cash on Delivery",
    },
    city: {
      type: String,
      required: [true, "City must be provided"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "processing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", OrderSchema);
