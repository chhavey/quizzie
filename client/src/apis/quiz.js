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
        throw new Error(error.response.data.message || 'Cannot fetch jobs');
    }
}

export default getAllQuiz;