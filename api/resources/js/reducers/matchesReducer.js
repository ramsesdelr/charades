import * as MatchesActionTypes from '../actiontypes/matches.js';

const initialState = {
    players: [],
    match_info: {},
};

export default function matchesReducer(state = initialState, action) {
    switch (action.type) {
        case MatchesActionTypes.UPDATE_SCORING: {
            const updatedPlayersScore = state.players.map((player, index) => {
                if (player.id === action.data.users_id) {
                    return {
                        ...player,
                        score: action.data.score,
                    };
                }
                
                return player;
            });

            let  updated_state = {
                match_info: state.match_info,
                players: updatedPlayersScore
            }
            return updated_state;
        }

        case MatchesActionTypes.GET_MATCH: {
            return action.data;
        }

        default:
            return state;
    };
}