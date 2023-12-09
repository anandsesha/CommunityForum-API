const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET on /api/tags - List all tags (authentication optional)
router.get('/', async (req, res, next) => {
  try {
    const tagsArray = [];
    const questions = await Question.find({});

    questions.forEach((question) => {
      question.tags.forEach((tag) => {
        if (!tagsArray.includes(tag)) {
          tagsArray.push(tag);
        }
      });
    });

    console.log(tagsArray);

    res.status(200).json({ tagsArray });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
