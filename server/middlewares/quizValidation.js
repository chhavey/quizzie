// Validate quiz fields
const validateQuizFields = (title, type, questions, timer) => {
    if (!title || !type || !questions) {
        throw { status: 400, message: 'All fields are required.' };
    }

    if (type === 'Q&A' && (timer === undefined || timer === null)) {
        throw { status: 400, message: 'Timer is required for Q&A quizzes.' };
    }
};

// Validate questions
const validateQuestions = (questions, type) => {
    if (!Array.isArray(questions) || questions.length === 0) {
        throw { status: 400, message: 'Please provide at least one question.' };
    }

    for (const question of questions) {
        if (questions.length > 5) {
            throw { status: 400, message: `Cannot have more than 5 questions.` };
        }

        // if (!question.question || !Array.isArray(question.options) || question.options.length < 2) {
        //     throw { status: 400, message: 'Minimum two options are required' };
        // }

        if (type === 'Q&A' && !question.correctOption) {
            throw { status: 400, message: 'Each question must have a correct option' };
        }
    }
};

module.exports = { validateQuizFields, validateQuestions };