const axios = require('axios');

export const matchesService = {
    createMatch,
    getMatch,
    getRandomWord,
    addScorePoint,
    invitePlayer
};



function createMatch(match_data) {

    let user = JSON.parse(localStorage.getItem('user')) || {};

    let config = {
        headers: { 'Authorization': "bearer " + user.token }
    };

    return axios.post('/api/matches', {
        name: match_data.name,
        password: match_data.password,
        users_id: match_data.users_id,
    }, config)
        .then((response) => {
            return response;
        }).catch((error) => {
            return error;
        });
}
/**
 * Get a match by ID
 * @param {integer} match_id 
 * @return {array}
 */
function getMatch(match_id) {

    let user = JSON.parse(localStorage.getItem('user')) || {};

    let config = {
        headers: { 'Authorization': "bearer " + user.token, 
        'user_email' : user.user_data.email
    }
    };
    //TODO: check API getMatch and validate the user token with the match_id
    return axios.get(`/api/matches/${match_id}`, config).then( (response) => {
        return response;
    }).catch((error) => {
        return error;
    });
}

/**
 * Get a random word for the match
 * @return {object}
 */
function getRandomWord() {
    return axios.get('/api/word/').then( (response) => {
        return response.data.title;
    }).catch((error) => {
        return error;
    });
}


/**
 * Sum a point to the current player
 * @param {integer} user_id 
 * @param {integer} match_id 
 */
function addScorePoint(user_id, match_id) {
    let user = JSON.parse(localStorage.getItem('user')) || {};
    
    let config = {
        headers: { 'Authorization': "bearer " + user.token }
    };

    return axios.post('/api/scorings/add_point', {
        users_id: user_id,
        matches_id: match_id,
    }, config).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });
}

/**
 * Invite a new or existing user to join the current match
 * @param {string} email 
 * @param {integer} match_id 
 * @return {string}
 */
function invitePlayer(email, match_id) {

    let user = JSON.parse(localStorage.getItem('user')) || {};

    let config = {
        headers: { 'Authorization': "bearer " + user.token }
    };

    return axios.post('/api/matches/invite_user', {
        match_id: match_id,
        email: email,
    }, config).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });

}