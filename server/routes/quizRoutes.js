const router = require('express').Router();
const { fetchAllQuiz, createQuiz, fetchQuiz, editQuiz, deleteQuiz } = require('../controllers/quizController');
const requireAuth = require('../middlewares/requireAuth');

router.get('/all', requireAuth, fetchAllQuiz);
router.post('/create', requireAuth, createQuiz);
router.get('/:quizId', requireAuth, fetchQuiz);
router.put('/:quizId', requireAuth, editQuiz);
router.delete('/:quizId', requireAuth, deleteQuiz);

module.exports = router;