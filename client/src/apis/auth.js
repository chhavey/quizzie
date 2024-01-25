import axios from 'axios';

const login = async (email, password) => {
    try {
        const reqUrl = "http://localhost:4000/user/login";
        const reqPayload = {
            email: email,
            password: password
        }

        const response = await axios.post(reqUrl, reqPayload);

        if (response.status === 200) {
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("loggedInUser", response.data.data.loggedUser);
        }
        console.log(response.data.message);

        return response.data.message;

    } catch (error) {
        throw new Error(error.response.data.message || 'Login failed!');
    }
}

const register = async (name, email, password) => {
    try {
        const reqUrl = "http://localhost:4000/user/register";
        const reqPayload = {
            name: name,
            email: email,
            password: password
        }

        const response = await axios.post(reqUrl, reqPayload);
        return response.data.message;

    } catch (error) {
        throw new Error(error.response.data.message || 'Registration failed!');
    }
}

export { login, register };