const express = require('express');
const router = express.Router();
const Quiz = require('../models/quizModel');
const errorHandler = require('../middlewares/errorHandler');

router.post('/create', async (req, res) => {
    try {
        const { title, type, questions, responseType, timer } = req.body;
        const { name } = req.body.user;
        const newQuiz = new Quiz({
            title,
            type,
            questions,
            responseType,
            timer,
            creator: name,
            date: new Date(),
        });

        await newQuiz.save();

        res.json({
            status: 'SUCCESS',
            message: "Quiz created successfully",
            id: newQuiz._id
        });

    } catch (error) {
        errorHandler(res, error);
    }
})

module.exports = router;



//all possible routes:

// Authentication Routes:
// /user/signup: User registration
// /user/login: User login
// /user/logout: User logout

// User Dashboard Routes:
// /dashboard: Fetch user's quizzes
// /quiz/create: Create a new quiz
// /quiz/:id: Get details of a specific quiz
// /quiz/:id/share: Share a quiz

// Quiz Taking Routes:
// /quiz/:id/take: Take a quiz as an anonymous user
// /quiz/:id/score: Show user's score after Q&A quiz

// Analytics Routes:
// /quiz/:id/analytics: Get analytics for a specific quiz