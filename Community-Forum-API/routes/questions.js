var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const Question = require('../models/Question');
const User = require('../models/User');
const Answer = require('../models/Answer');

// A utility function to convert Mongoose ObjectIds to strings - since the Question Schema is modelled to have "author" field as the user Obect ID,
//  so querrying the userID returns something like : new ObjectId('65726adc7069d9040b298a04') but we need to store like: 65726adc7069d9040b298a04
// Or we can use user._id.toString() everywhere instead.

function objectIdToString(objectId) {
  return String(objectId);
}

// POST on /api/questions - Create a question on the Community Forum (authentication required)
router.post('/', auth.verifyToken, async (req, res, next) => {
  try {
    var { title, author, slug, description, tags } = req.body;
    // console.log(title, author, slug, description, tags);

    if (!title || !author || !slug) {
      res.status(400).json({
        error: 'title, author and slug mandatory for creating a question',
      });
    }
    // Find the user by username to get the corresponding ObjectId - since author field needs the id to associate with the User as per schema
    //   So, author name coming in req - using that name we get all fields of that User (including his _id) - pasing that below we create the question (which needs author: <userid>)
    var user = await User.findOne({ username: author });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    var createdQuestion = await Question.create({
      title,
      author: user._id,
      slug,
      description,
      tags,
    });

    // console.log(createdQuestion);
    res.status(201).json({ questions: [createdQuestion] });
  } catch (error) {
    next(error);
  }
});

// GET on /api/questions - Lists all question on the Community Forum (authentication optional)
router.get('/', async (req, res, next) => {
  var allQuestions = await Question.find({});
  res.status(201).json({ questions: allQuestions });
});

// PUT on /api/questions/:questionId - UPDATEs the question (authentication required)
router.put('/:questionId', auth.verifyToken, async (req, res, next) => {
  var questionID = req.params.questionId;
  //   console.log(questionID);
  var { author, slug, title, description, tags } = req.body;

  try {
    var userForThisQuestion = await User.findOne({ username: author });

    console.log(userForThisQuestion);
    if (!userForThisQuestion) {
      return res.status(404).json({
        error:
          'The User who posted this question is not found. Hence unable to update the question',
      });
    }
    // console.log(objectIdToString(userForThisQuestion._id));
    var updatedQuestion = await Question.findByIdAndUpdate(
      { _id: questionID },
      {
        author: objectIdToString(userForThisQuestion._id),
        slug,
        title,
      },
      { new: true }
    );
    console.log(objectIdToString(userForThisQuestion._id), slug, title);

    // console.log(updatedQuestion);
    res.status(201).json({ question: updatedQuestion });
  } catch (error) {
    next(error);
  }
});

// DELETE - /api/questions/:slug - Deletes the question and all its associated answers. (authentication required)
router.delete('/:slug', auth.verifyToken, async (req, res, next) => {
  var slug = req.params.slug;
  console.log(slug);
  try {
    var deletedQuestion = await Question.findOneAndDelete({ slug: slug });
    console.log(deletedQuestion);
    // console.log(deletedQuestion.id);

    // var deletedAnswers = await Answer.findByIdAndDelete({
    //   questionId: deletedQuestion._id,
    // });
    // console.log(deletedAnswers);

    res.status(201).json({ question: deletedQuestion });
  } catch (error) {
    next(error);
  }
});

// Create and List answers handled here. Update and delete answers handled in routes/answers.js

// POST on /api/questions/:questionId/answers - Add an answer to an existing question (authentication required)
router.post(
  '/:questionId/answers',
  auth.verifyToken,
  async (req, res, next) => {
    try {
      var questionId = req.params.questionId;
      var { text, author } = req.body;

      if (!text || !author) {
        return res.status(400).json({
          error: 'text and author are mandatory for creating an answer',
        });
      }

      // Find the user by username to get the corresponding ObjectId
      var user = await User.findOne({ username: author });

      if (!user) {
        return res.status(404).json({ error: 'Author (User) not found' });
      }

      var createdAnswer = await Answer.create({
        text,
        author: user._id,
        questionId,
      });

      //   Update the question collection id DB with teh answer created
      await Question.findByIdAndUpdate(
        questionId,
        { $push: { answers: createdAnswer._id } },
        { new: true }
      );

      res.status(201).json({ answers: createdAnswer });
    } catch (error) {
      next(error);
    }
  }
);

// GET on /api/questions/:questionId/answers - List all answers for the given question (authentication required)
router.get('/:questionId/answers', auth.verifyToken, async (req, res, next) => {
  try {
    const questionId = req.params.questionId;

    const answers = await Answer.find({ questionId });

    res.status(200).json({ answers: [answers] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
