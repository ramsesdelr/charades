import { authHeader } from '../helpers/auth-header.js';
const axios = require('axios');

export const usersService = {
    login,
    logout,
    getAll,
    register
};

function login(email, password) {
    return axios.post('api/users/login', {
            email: email,
            password: password,
        }).then( (response) => {
            localStorage.setItem('token', response.data.token);
            return response;
        }).catch( (error)=> {
            return error;
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
    return axios.get('api/users', config).then( (response) => {
            return response;
        });
}

function register(data) {
    return axios.post('api/users/register', {
            email: data.email,
            password: data.password,
            phone: data.phone,
            name: data.name,
        }).then( (response) => {
            if(response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response;
        });
}