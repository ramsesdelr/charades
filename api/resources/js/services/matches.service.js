const axios = require('axios');

export const matchesService = {
    createMatch,
    getMatch
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