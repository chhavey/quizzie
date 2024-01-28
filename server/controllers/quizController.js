const Quiz = require('../models/quizModel');
const handleResponse = require('../middlewares/responseHandler');
const { validateQuizFields, validateQuestions } = require('../middlewares/quizValidation');
const errorHandler = require('../middlewares/errorHandler');

//to fetch all quiz
const fetchAllQuiz = async (req, res) => {
    try {
        const allQuizzes = await Quiz.find({});
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
    const { title, type, questions, responseType, timer } = req.body;
    const { name } = req.body.user;

    try {
        validateQuizFields(title, type, questions, responseType, timer);
        validateQuestions(questions, type);
        const newQuiz = new Quiz({
            title,
            type,
            questions,
            responseType,
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
        // console.log(error);
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
    const { title, type, questions, responseType, timer } = req.body;
    const quizId = req.params.quizId;
    try {
        validateQuizFields(title, type, questions, responseType, timer);
        validateQuestions(questions, type);
        const result = await Quiz.findByIdAndUpdate(quizId, { title, type, questions, responseType, timer });

        if (!result) {
            handleResponse(res, 404, 'Quiz not found.');
            return;
        }
        handleResponse(res, 200, 'Quiz updated successfully');
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
            } else {
                question.incorrectAttempts += 1;
            }
            question.totalAttempts = question.correctAttempts + question.incorrectAttempts;

            await quiz.save();
            const totalQuestions = quiz.questions.length;
            const totalCorrectOptions = quiz.questions.reduce((sum, q) => sum + (q.correctAttempts > 0 ? 1 : 0), 0);

            handleResponse(res, 200, 'User response recorded successfully', {
                result: {
                    totalCorrectOptions,
                    totalQuestions
                }
            });
        } else if (quiz.type === 'poll') {
            const selectedOptionIndex = question.options.findIndex(option => option.option === selectedOption);
            if (selectedOptionIndex !== -1) {
                question.options[selectedOptionIndex].frequency += 1;
                await quiz.save();

                handleResponse(res, 200, 'User response recorded successfully');

            } else {
                handleResponse(res, 400, 'Invalid selected option.');

            }
        }
    } catch (error) {
        errorHandler(res, error);
    }
};


module.exports = { fetchAllQuiz, createQuiz, fetchQuiz, fetchAnalytics, editQuiz, deleteQuiz, recordUserResponse }