const Quiz = require('../models/quizModel');
const errorHandler = require('../middlewares/errorHandler');

//to fetch all quiz
const fetchAllQuiz = async (req, res) => {
    try {
        const allQuizzes = await Quiz.find({});
        res.status(200).json(allQuizzes);
    }
    catch (error) {
        errorHandler(res, error);
    }
}

//Create new quiz
const createQuiz = async (req, res) => {
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
}

module.exports = { fetchAllQuiz, createQuiz }