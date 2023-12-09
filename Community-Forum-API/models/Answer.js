const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question', // Reference to the Question model
      required: true,
    },
  },
  { timestamps: true }
);

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
