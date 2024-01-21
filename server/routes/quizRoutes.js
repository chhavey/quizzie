const router = require('express').Router();
const { fetchAllQuiz, createQuiz } = require('../controllers/quizController');
const requireAuth = require('../middlewares/requireAuth');

router.get('/all', requireAuth, fetchAllQuiz);
router.post('/create', requireAuth, createQuiz);

module.exports = router;