const mongoose = require("mongoose");
const Cart = require("./Cart");

const productSchema = new mongoose.Schema(
  {
    p_name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
    },
    p_desc: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      catId: {
        type: mongoose.Types.ObjectId,
        ref: "category",
      },
    },
    img: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    stock: {
      type: Number,
      default: 1,
      required: [true, "Please provide stock"],
    },
    review: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "user",
          required: [true, "You must login to review"],
        },

        name: {
          type: String,
        },

        comment: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", productSchema);
