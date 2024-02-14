const router = require('express').Router();
const { fetchAllQuiz, createQuiz, fetchQuiz, editQuiz, deleteQuiz, recordUserResponse, fetchAnalytics } = require('../controllers/quizController');
const requireAuth = require('../middlewares/requireAuth');

router.get('/all', requireAuth, fetchAllQuiz);
router.post('/create', requireAuth, createQuiz);
router.get('/:quizId', fetchQuiz);
router.put('/:quizId', requireAuth, editQuiz);
router.delete('/:quizId', requireAuth, deleteQuiz);
router.get('/analytics/:quizId', requireAuth, fetchAnalytics);
router.post('/:quizId/:questionId', recordUserResponse);


module.exports = router;