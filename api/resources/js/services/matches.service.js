const axios = require('axios');

export const matchesService = {
    createMatch,
};

function createMatch(match_name, match_password = null) {
    
    let user = this.state.user;
    
    let config = {
        headers: { 'Authorization': "bearer " + user.token }
    };

    return axios.post('api/matches', {
        name: match_name,
        password: match_password,
    }, config).then((response) => {
        console.log(response);
        return response;
    }).catch((error) => {
        return error;
    });
}