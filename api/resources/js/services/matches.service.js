const axios = require('axios');

export const matchesService = {
    createMatch,
    getMatch,
    getRandomWord,
    getRandomWords,
    addScorePoint,
    invitePlayer,
    notifyPlayerMatchStarted,
    updatePlayerTurn,
    notifyPlayerMatchStopped,
    addMatchWinner,
    getRecentMatchesByUser
};

/**
 * Create a new match
 * @param array match_data 
 */
function createMatch(match_data) {

    let user = JSON.parse(localStorage.getItem('user')) || {};

    let config = {
        headers: { 'Authorization': "bearer " + user.token }
    };

    return axios.post('/matches', {
        name: match_data.name,
        categories_id: match_data.categories_id,
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
 * @param integer match_id 
 * @return array
 */
function getMatch(match_id) {

    let user = JSON.parse(localStorage.getItem('user')) || {};

    let config = {
        headers: { 'Authorization': "bearer " + user.token, 
        'user_email' : user.user_data.email
    }
    };
    //TODO: check API getMatch and validate the user token with the match_id
    return axios.get(`/matches/${match_id}`, config).then( (response) => {
        return response;
    }).catch((error) => {
        return error;
    });
}

/**
 * Get a random word for the match
 * @param array used_words
 * @param integer category_id
 * @return string
 */
function getRandomWord(used_words  = [], category_id) {
    return axios.post('/word', {
        used_words: used_words,
        category_id: category_id
    }).then( (response) => {
        return response.data;
    }).catch((error) => {
        return error;
    });

    
}

/**
 * Get a random word for the match
 * @return {object}
 */
function getRandomWords() {
    return axios.get('/words/').then( (response) => {
        return response.data;
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

    return axios.post('/scorings/add_point', {
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
function invitePlayer(invite_info, match_id) {

    let user = JSON.parse(localStorage.getItem('user')) || {};

    let config = {
        headers: { 'Authorization': "bearer " + user.token }
    };

    return axios.post('/matches/invite_user', {
        match_id: match_id,
        email: invite_info.email,
        phone: invite_info.phone_number,
    }, config).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });

}
/**
 * Notify player when the match starts
 * @param {integer} player_id 
 */
function notifyPlayerMatchStarted(player_id) {
    let user = JSON.parse(localStorage.getItem('user')) || {};

    let config = {
        headers: { 'Authorization': "bearer " + user.token }
    };


    return axios.get(`/matches/notify_player_match_status/${player_id}/started`, config).then( (response) => {
        return response;
    }).catch((error) => {
        return error;
    });
}
/**
 * Notify all players when the match stopped
 * @param {int} player_id 
 */
function notifyPlayerMatchStopped(player_id) {

    let user = JSON.parse(localStorage.getItem('user')) || {};

    let config = {
        headers: { 'Authorization': "bearer " + user.token }
    };

    return axios.get(`/matches/notify_player_match_status/${player_id}/stopped`, config).then( (response) => {
        return response;
    }).catch((error) => {
        return error;
    });
}

function updatePlayerTurn(player_id, match_id) {

    return axios.post('/matches/update_player_turn', {
        player_id: player_id,
        match_id : match_id,
    }).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });
}
/**
 * Add the winner of a finished match
 * @param int match_d
 * @param int winner_id
 */
function addMatchWinner(match_id) {
    let user = JSON.parse(localStorage.getItem('user')) || {};

    let config = {
        headers: { 'Authorization': "bearer " + user.token }
    };

    return axios.post('/matches/add_winner', {
        match_id: match_id,
    }, config).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });
}
/**
 * Retrieve the latest matches played by a user
 * @param int user_id
 * @return string
 */
function getRecentMatchesByUser(user_id) {
   
    return axios.get(`/matches/recent/${user_id}`).then( (response) => {
        return response.data;
    }).catch((error) => {
        return error;
    });
}