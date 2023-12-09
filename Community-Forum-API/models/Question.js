const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Each Author Referenced to a user in User Schema
      required: true,
    },
    slug: { type: String, required: true },
    tags: [String],
    answers: [
      // Cross-referencing
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer', // Reference to the Answer model
      },
    ],
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
