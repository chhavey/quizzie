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
            creator: name
        });

        await newQuiz.save();

        res.status(201).json({
            status: 'SUCCESS',
            message: "Quiz created successfully",
            id: newQuiz._id
        });

    } catch (error) {
        errorHandler(res, error);
    }
}

//Fetch quiz
const fetchQuiz = async (req, res) => {
    const quizId = req.params.quizId;

    try {
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Quiz not found.'
            });
        }

        res.status(200).json(quiz);
    } catch (error) {
        errorHandler(res, error);
    }
}

//Edit quiz
const editQuiz = async (req, res) => {
    const { title, type, questions, responseType, timer } = req.body;
    const quizId = req.params.quizId;

    try {
        // Additional check for changing quiz type to 'Q&A'
        if (type === 'Q&A') {
            if (timer === undefined || timer === null) {
                return res.status(400).json({
                    status: 'FAILED',
                    message: 'Timer is required for Q&A quizzes.',
                });
            }
        }

        await Quiz.findByIdAndUpdate(quizId, { title, type, questions, responseType, timer });
        res.status(200).json({
            status: "SUCCESS",
            message: "Quiz updated successfully"
        });
    } catch (error) {
        errorHandler(res, error);
    }
}

//Delete quiz
const deleteQuiz = async (req, res) => {
    const quizId = req.params.quizId;
    try {
        await Quiz.findByIdAndDelete(quizId);
        res.status(200).json({
            status: 'SUCCESS',
            message: "Quiz deleted successfully"
        });

    } catch (error) {
        errorHandler(res, error);
    }
}



module.exports = { fetchAllQuiz, createQuiz, fetchQuiz, editQuiz, deleteQuiz }