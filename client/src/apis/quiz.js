import axios from 'axios';

const getAllQuiz = async ({ token }) => {
    try {
        const reqUrl = `http://localhost:4000/quiz/all`;
        const response = await axios.get(reqUrl, {
            headers: {
                'Authorization': token,
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.message || 'Cannot fetch all quizzes');
    }
}

const createQuiz = async ({ quizData, token }) => {
    try {
        const reqUrl = `http://localhost:4000/quiz/create`;
        const response = await axios.post(reqUrl, {
            headers: {
                'Authorization': token,
            }
        });
        return response.status;
    } catch (error) {
        throw new Error(error.message || 'Cannot create quiz');
    }
}

const fetchQuiz = async ({ quizId, token }) => {
    try {
        const reqUrl = `http://localhost:4000/quiz/${quizId}`;
        const response = await axios.get(reqUrl, {
            headers: {
                'Authorization': token,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Cannot fetch quiz');
    }
}

const fetchAnalytics = async ({ quizId, token }) => {
    try {
        const reqUrl = `http://localhost:4000/quiz/analytics/${quizId}`;
        const response = await axios.get(reqUrl, {
            headers: {
                'Authorization': token,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Cannot fetch quiz');
    }
}

const editQuiz = async ({ quizId, quizDetails, token }) => {
    try {
        const reqUrl = `http://localhost:4000/quiz/${quizId}`;
        const response = await axios.put(reqUrl, quizDetails, {
            headers: {
                'Authorization': token,
            }
        });
        return response.status;
    } catch (error) {
        throw new Error(error.message || 'Cannot edit quiz');
    }
}

const deleteQuiz = async ({ quizId, token }) => {
    try {
        const reqUrl = `http://localhost:4000/quiz/${quizId}`
        const response = await axios.delete(reqUrl, {
            headers: {
                'Authorization': token,
            }
        })
        return response.status;
    } catch (error) {
        throw new Error(error.message || 'Cannot delete quiz');
    }
}

export { getAllQuiz, createQuiz, fetchQuiz, editQuiz, deleteQuiz, fetchAnalytics };