const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Answer = require('../models/Answer');
const Question = require('../models/Question');

// Only update and delete an answer handled here. Create and List answer handled in questions.js

// PUT on /api/answers/:answerId - Update an answer (authentication required)
router.put('/:answerId', auth.verifyToken, async (req, res, next) => {
  try {
    const answerId = req.params.answerId;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Answer text is required' });
    }

    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      { text },
      { new: true }
    );

    res.status(200).json({ answer: updatedAnswer });
  } catch (error) {
    next(error);
  }
});

// DELETE on /api/answers/:answerId - Delete an answer (authentication required)
router.delete('/:answerId', auth.verifyToken, async (req, res, next) => {
  try {
    var answerId = req.params.answerId;

    var deletedAnswer = await Answer.findByIdAndDelete(answerId);

    if (!deletedAnswer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Remove the reference from the associated question
    var updatedQuestion = await Question.updateOne(
      { _id: deletedAnswer.questionId },
      { $pull: { answers: answerId } }
    );

    res.status(200).json(deletedAnswer);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
