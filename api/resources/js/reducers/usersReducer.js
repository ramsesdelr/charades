import * as UserActionTypes from '../actiontypes/users.js';

const initialState = {
 
};

export default function usersReducer(state = initialState, action) {
    switch(action.type) {
        case UserActionTypes.LOGIN_USER: {
        
            return action.data;
        }
        case UserActionTypes.GET_USER_DATA: {
            return state;
        }
        default:
            return state;
    };
}