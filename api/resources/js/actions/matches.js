import * as MatchesActionTypes from '../actiontypes/matches.js';

export const updateScoring = (data) => {
    return {
        type: MatchesActionTypes.UPDATE_SCORING,
        data: data
    };
};

export const getMatch = (data) => {
    return {
        type: MatchesActionTypes.GET_MATCH,
        data: data
    };
};