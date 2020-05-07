const axios = require('axios');

export const usersService = {
    login,
    logOut,
    getAll,
    register,
    getUser
};

/**
 * Log in the user
 * @param {array} login_data 
 * @param {string} password 
 */
function login(login_data) {
    return axios.post('/api/users/login', {
            email: login_data.email,
            password: login_data.password,
            match_id: login_data.match_id
        }).then( (response) => {
            localStorage.setItem('user', JSON.stringify(response.data));
            return response; 
        }).catch( (error)=> {
            return error;
        });
}

/**
 * Log out the user
 */
function logOut() {
    // remove token from local storage to log user out
    localStorage.removeItem('user');
}

/**
 * Get all users
 */
function getAll() {
    let user = JSON.parse(localStorage.getItem('user'));

    if(user && user.token) {
        let config = {
            headers: {'Authorization': "bearer " + user.token}
        };
        return axios.get('/api/users', config).then( (response) => {
            return response;
        });
    }

}

/**
 * Register a new user
 * @param {object} data 
 */
function register(data) {
    return axios.post('/api/users/register', {
            email: data.email,
            password: data.password,
            phone: data.phone,
            name: data.name,
            match_id: data.match_id
        }).then( (response) => {
            if(response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response;
    });
}

/**
 * Get user from token
 * @param {string} token 
 */
function getUser(token) {
   
    let config = {
        headers: {'Authorization': "bearer " + token}
    };

    return axios.get('/api/user', config).then( (response) => {
        return response;
    });
}