const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a category"],
    unique: true,
  },
});

module.exports = mongoose.model("category", CategorySchema);
