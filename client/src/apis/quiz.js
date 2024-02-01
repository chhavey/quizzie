import axios from 'axios';
import { backendUrl } from '../config/config';

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
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
        } else if (error.message === 'Internal Server Error') {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        } else {
            throw new Error('Cannot fetch all quizzes. Please try again later.');
        }
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
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
        } else if (error.message === "Internal Server Error") {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        } else {
            throw new Error('Cannot create quiz. Please try again later.');
        }
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
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
        } else if (error.message === 'Internal Server Error') {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        } else {
            throw new Error('Cannot fetch quiz details. Please try again later.');
        }
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
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
        } else if (error.message === 'Internal Server Error') {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        } else {
            throw new Error('Cannot fetch quiz analytics. Please try again later.');
        }
    }
}

const editQuiz = async (quizId, { questionData, timer }, token) => {
    try {
        const reqUrl = `${backendUrl}/quiz/${quizId}`;
        const quizDetails = {
            questions: questionData,
            timer: timer,
        };
        console.log(quizDetails);
        const response = await axios.put(reqUrl, quizDetails, {
            headers: {
                'Authorization': token,
            }
        });
        return response;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
        } else if (error.message === 'Internal Server Error') {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        } else {
            throw new Error('Cannot edit quiz. Please try again later.');
        }
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
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
        } else if (error.message === 'Internal Server Error') {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        } else {
            throw new Error('Cannot delete quiz. Please try again later.');
        }
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

        return response.data.data.result.score;

    } catch (error) {
        throw new Error(error.message || 'Error recording user response');
    }
};


export { getAllQuiz, createQuiz, fetchQuiz, editQuiz, deleteQuiz, fetchAnalytics, recordUserResponse };