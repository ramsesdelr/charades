
const axios = require('axios');

export const usersService = {
    login,
    logOut,
    getAll,
    register,
    getUser,
    refreshToken,
    createWord,
    updateUser,
    getCategories,
    resetPassword,
    addUserToMatch,
    loginFacebook,
    formatPhoneNumber
};

/**
 * Log in the user
 * @param array login_data 
 * @param string password 
 */
function login(login_data) {
    return axios.post('/users/login', {
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
 * Log in the user with Facebook information
 * @param array login_data 
 */
function loginFacebook(login_data) {
    return axios.post('/users/facebook_login', {
            email: login_data.email,
            name: login_data.name,
            userID: login_data.userID,
            accessToken: login_data.accessToken
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
    return axios.get('/users').then( (response) => {
        return response;
    });
}

/**
 * Register a new user
 * @param {object} data 
 */
function register(data) {
    return axios.post('/users/register', {
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
 * @return string 
 */
function getUser() {
    return axios.get('/user').then( (response) => {
        return response;
    });
}

/**
 * Try to refresh the token 
 * @param int token
 * @return boolean
 */
function refreshToken() {
    return axios.post('/users/refresh_token').then( (response) => {
        if(response.error) {
            return;
        }
        return response;
    });
}
/**
 * Create a new word
 * @param array data
 * @return string
 */
function createWord(data) {
    return axios.post('/words/add', {
        title: data.title,
        users_id: data.users_id,
        categories_id: data.categories_id,
    }).then((response) => {
        return response;
    });
}

/**
 * Update User Information
 * @param array user_data 
 * @return string
 */
function updateUser(user_data) {
    return axios.put(`/users/${user_data.users_id}`, {
        name: user_data.name,
        email: user_data.email,
        phone: user_data.phone,
        password: user_data.password,
        password_validate: user_data.password_validate,
        profile_img: user_data.profile_img,
        users_id: user_data.users_id
    }).then((response) => {
        console.log(response);
        return response.data;
    });
}

/**
 * Retrieve all categories for selected words
 * @return array
 */
function getCategories() {
    return axios.get('/categories').then( (response) => {
        return response.data;
    });
}

/**
 * Reset password by email
 * @param string email 
 */
function resetPassword(email) {
    return axios.post('/users/password_reset', {
        email: email,
    }).then((response) => {
        return response;
    });
}

/**
 * Add user to a match if it's already logged in
 * @param string email 
 * @param int match_id 
 */
function addUserToMatch(email, match_id) {
    return axios.post('/users/add_user_to_match', {
        email: email,
        match_id: match_id,
    }).then((response) => {
        return response;
    });
}

/**
 * Formats the phone number
 * @param string phoneNumberString 
 * @return mixed string|null
 * Source: https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
 */
function  formatPhoneNumber(phoneNumberString) {
    let cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3]
    }
    return phoneNumberString
}