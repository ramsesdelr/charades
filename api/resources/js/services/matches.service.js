const axios = require('axios');

export const matchesService = {
    createMatch,
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