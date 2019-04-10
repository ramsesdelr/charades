import { authHeader } from '../helpers/auth-header.js';
const axios = require('axios');

export const usersService = {
    login,
    logout,
    getAll
};

function login(email, password) {
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

function getAll() {
    let token = localStorage.getItem('token');
    let config = {
        headers: {'Authorization': "bearer " + token}
    };
    return axios.get('api/users', {
            email: email,
            password: password,
        }, config).then( (response) => {
            localStorage.setItem('token', response.data.token);
            return response;
        });
}