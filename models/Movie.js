const mongoose = require("mongoose");
const { Schema } = mongoose;

const MovieSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],

      min: [1, "Must be at least 1, got {VALUE}"],
      max: [5, "Less than or equal to 5, got {VALUE}"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
