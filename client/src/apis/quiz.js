import axios from 'axios';
import backendUrl from '../config/config';

const getAllQuiz = async ({ token }) => {
    try {
        const reqUrl = `${backendUrl}/quiz/all`;
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
        const reqUrl = `${backendUrl}/quiz/create`;
        const response = await axios.post(reqUrl, quizData, {
            headers: {
                'Authorization': token,
            }
        });
        return response;
    } catch (error) {
        throw new Error(error.message || 'Cannot create quiz');
    }
}

const fetchQuiz = async ({ quizId, token }) => {
    try {
        const reqUrl = `${backendUrl}/quiz/${quizId}`;
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
        const reqUrl = `${backendUrl}/quiz/analytics/${quizId}`;
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
        const reqUrl = `${backendUrl}/quiz/${quizId}`;
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
        const reqUrl = `${backendUrl}/quiz/${quizId}`
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

// Function to record user response
const recordUserResponse = async ({ quizId, questionId, selectedOption, token }) => {
    try {
        const reqUrl = `${backendUrl}/quiz/${quizId}/${questionId}`;
        const response = await axios.post(reqUrl, { selectedOption },
            {
                headers: {
                    'Authorization': token,
                }
            }
        );
        return response.data.data.result;

    } catch (error) {
        throw new Error(error.message || 'Error recording user response');
    }
};


export { getAllQuiz, createQuiz, fetchQuiz, editQuiz, deleteQuiz, fetchAnalytics, recordUserResponse };