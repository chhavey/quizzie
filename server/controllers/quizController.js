const Quiz = require('../models/quizModel');
const handleResponse = require('../middlewares/responseHandler');
const { validateQuizFields, validateQuestions } = require('../middlewares/quizValidation');
const errorHandler = require('../middlewares/errorHandler');

//to fetch all quiz
const fetchAllQuiz = async (req, res) => {
    try {
        const { name } = req.body.user;
        const allQuizzes = await Quiz.find({ creator: name });
        const totalQuizzes = allQuizzes.length;
        const totalQuestions = allQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
        const totalImpressions = allQuizzes.reduce((sum, quiz) => sum + quiz.impressions, 0);

        handleResponse(res, 200, 'All quizzes fetched successfully', {
            allQuizzes: allQuizzes,
            totalQuizzes: totalQuizzes,
            totalQuestions: totalQuestions,
            totalImpressions: totalImpressions
        });
    }
    catch (error) {
        errorHandler(res, error);
    }
}

//Create new quiz
const createQuiz = async (req, res) => {
    const { title, type, questions, timer } = req.body;
    const { name } = req.body.user;

    try {
        validateQuizFields(title, type, questions, timer);
        validateQuestions(questions, type);
        const newQuiz = new Quiz({
            title,
            type,
            questions,
            timer,
            creator: name
        });

        await newQuiz.save();

        handleResponse(res, 201, 'Quiz created successfully', { id: newQuiz._id });

    } catch (error) {
        if (error.status && error.status === 400) {
            handleResponse(res, 400, error.message);
        } else {
            errorHandler(res, error);
        }
    }
}

//Fetch quiz
const fetchQuiz = async (req, res) => {
    const quizId = req.params.quizId;

    try {
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            handleResponse(res, 404, 'Quiz not found.');
            return;
        }

        await Quiz.findByIdAndUpdate(quizId, { $inc: { impressions: 1 } });


        handleResponse(res, 200, 'Quiz fetched successfully', quiz);

    } catch (error) {
        errorHandler(res, error);
    }
}

//Fetch quiz analytics
const fetchAnalytics = async (req, res) => {
    const quizId = req.params.quizId;

    try {
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            handleResponse(res, 404, 'Quiz not found.');
            return;
        }

        handleResponse(res, 200, 'Quiz analytics fetched successfully', quiz);

    } catch (error) {
        errorHandler(res, error);
    }
}

//Edit quiz
const editQuiz = async (req, res) => {
    const { questions, timer } = req.body;
    const quizId = req.params.quizId;
    try {
        const result = await Quiz.findByIdAndUpdate(quizId, { questions, timer });

        if (!result) {
            handleResponse(res, 404, 'Quiz not found.');
            return;
        }
        handleResponse(res, 200, 'Quiz updated successfully', { id: quizId });

    } catch (error) {
        if (error.status && error.status === 400) {
            handleResponse(res, 400, error.message);
        } else {
            errorHandler(res, error);
        }
    }
}

//Delete quiz
const deleteQuiz = async (req, res) => {
    const quizId = req.params.quizId;
    try {
        await Quiz.findByIdAndDelete(quizId);
        handleResponse(res, 200, 'Quiz deleted successfully');

    } catch (error) {
        errorHandler(res, error);
    }
}

const recordUserResponse = async (req, res) => {
    const { quizId, questionId } = req.params;
    const { selectedOption } = req.body;
    let score = 0;

    try {
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            handleResponse(res, 404, 'Quiz not found.');
        }

        // To find the question within the quiz by its questionId
        const question = quiz.questions.id(questionId);

        if (!question) {
            handleResponse(res, 404, 'Question not found.');
            return;
        }
        if (quiz.type === 'Q&A') {
            if (selectedOption === question.correctOption) {
                question.correctAttempts += 1;
                score += 1;
            } else {
                question.incorrectAttempts += 1;
            }
            question.totalAttempts = question.correctAttempts + question.incorrectAttempts;

            await quiz.save();

            handleResponse(res, 200, 'User response recorded successfully', {
                result: {
                    score
                }
            });

        } else if (quiz.type === 'Poll') {
            if (selectedOption !== -1) {
                question.options[selectedOption].frequency += 1;

                handleResponse(res, 200, 'User response recorded successfully');

            } else {
                handleResponse(res, 400, 'Invalid selected option.');

            }
            await quiz.save();

        }
    } catch (error) {
        errorHandler(res, error);
    }
};


module.exports = { fetchAllQuiz, createQuiz, fetchQuiz, fetchAnalytics, editQuiz, deleteQuiz, recordUserResponse }