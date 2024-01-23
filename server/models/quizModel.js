const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    option: {
        type: String,
        required: true,
    },
    frequency: {
        type: Number,
        default: 0,
    },
});

const questionSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [responseSchema],
        required: true,
    },
    correctOption: {
        type: String,
        required: function () {
            return this.parent().type === 'Q&A';
        },
    },
    totalAttempts: {
        type: Number,
        default: 0
    },
    correctAttempts: {
        type: Number,
        default: 0
    },
    incorrectAttempts: {
        type: Number,
        default: 0
    },
});

const quizSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['poll', 'Q&A'],
        required: true,
    },
    questions: {
        type: [questionSchema],
        required: true,
    },
    responseType: {
        type: String,
        enum: ['Text', 'Image', 'Text-Image'],
        required: true,
    },
    impressions: {
        type: Number,
        default: 0,
    },
    timer: {
        type: Number,
        enum: [0, 5, 10],
        required: function () {
            return this.type === 'Q&A';
        },
    },
    creator: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);