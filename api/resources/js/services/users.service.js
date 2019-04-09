import { authHeader } from '../helpers/auth-header.js';

export const usersService = {
    login,
    logout
};

function login(email, password) {
    const axios = require('axios');

    return axios.post('api/users/login', {
            email: email,
            password: password,
        }).then( (response) => {
            localStorage.setItem('token', response.data.token);
            return response;
        });
}

function logout() {
    // remove token from local storage to log user out
    localStorage.removeItem('token');
}
