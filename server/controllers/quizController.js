const Quiz = require('../models/quizModel');
const errorHandler = require('../middlewares/errorHandler');

//to fetch all quiz
const fetchAllQuiz = async (req, res) => {
    try {
        const allQuizzes = await Quiz.find({});
        const totalQuizzes = allQuizzes.length;
        const totalQuestions = allQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
        const totalImpressions = allQuizzes.reduce((sum, quiz) => sum + quiz.impressions, 0);

        res.status(200).json({

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

    if (!title || !type || !questions || !responseType) {
        return res.status(400).json({
            status: 'FAILED',
            message: 'All fields are required.'
        });
    }

    // Additional check for changing quiz type to 'Q&A'
    if ((type === 'Q&A') && (timer === undefined || timer === null)) {
        return res.status(400).json({
            status: 'FAILED',
            message: 'Timer is required for Q&A quizzes.',
        });

    }

    // Validate questions and options
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
            status: 'FAILED',
            message: 'At least one question is required.',
        });
    }

    for (const question of questions) {
        if (!question.question || !Array.isArray(question.options) || question.options.length < 2) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Each question must have a question text and at least two options.',
            });
        }

        if (type === 'Q&A' && !question.correctOption) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'For Q&A quizzes, each question must have a correct option.',
            });
        }
    }
    try {
        const newQuiz = new Quiz({
            title,
            type,
            questions,
            responseType,
            timer,
            creator: name
        });

        await newQuiz.save();

        const quizUrl = `http://localhost:4000/quiz/${newQuiz._id}`; //wip

        res.status(201).json({
            status: 'SUCCESS',
            message: "Quiz created successfully",
            id: newQuiz._id,
            quizUrl: quizUrl //wip
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

        await Quiz.findByIdAndUpdate(quizId, { $inc: { impressions: 1 } });


        // quiz.impressions = (quiz.impressions || 0) + 1;
        // await quiz.save();

        res.status(200).json(quiz);

    } catch (error) {
        errorHandler(res, error);
    }
}

//Edit quiz
const editQuiz = async (req, res) => {
    const { title, type, questions, responseType, timer } = req.body;
    const quizId = req.params.quizId;

    if (!title || !type || !questions || !responseType) {
        return res.status(400).json({
            status: 'FAILED',
            message: 'All fields are required.'
        });
    }

    // Additional check for changing quiz type to 'Q&A'
    if ((type === 'Q&A') && (timer === undefined || timer === null)) {
        return res.status(400).json({
            status: 'FAILED',
            message: 'Timer is required for Q&A quizzes.',
        });

    }

    // Validate questions and options
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
            status: 'FAILED',
            message: 'At least one question is required.',
        });
    }

    for (const question of questions) {
        if (!question.question || !Array.isArray(question.options) || question.options.length < 2) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Each question must have a question text and at least two options.',
            });
        }

        if (type === 'Q&A' && !question.correctOption) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'For Q&A quizzes, each question must have a correct option.',
            });
        }
    }


    try {
        const result = await Quiz.findByIdAndUpdate(quizId, { title, type, questions, responseType, timer });

        if (!result) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Quiz not found.',
            });
        }

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


const recordUserResponse = async (req, res) => {
    const { quizId, questionId } = req.params;
    const { selectedOption } = req.body;

    try {
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Quiz not found.'
            });
        }

        // To find the question within the quiz by its questionId
        const question = quiz.questions.id(questionId);

        if (!question) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Question not found.'
            });
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

            res.status(200).json({
                status: 'SUCCESS',
                message: 'User response recorded successfully.',
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

                res.status(200).json({
                    status: 'SUCCESS',
                    message: 'User response recorded successfully.'
                });

            } else {
                return res.status(400).json({
                    status: 'FAILED',
                    message: 'Invalid selected option.'
                });

            }
        }


    } catch (error) {
        errorHandler(res, error);
    }
};


module.exports = { fetchAllQuiz, createQuiz, fetchQuiz, editQuiz, deleteQuiz, recordUserResponse }