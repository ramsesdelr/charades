import * as UserActionTypes from '../actiontypes/users.js';

const initialState = {
    user: null
};

export default function usersReducer(state = initialState, action) {
    switch(action.type) {
        case UserActionTypes.LOGIN_USER: {
        
            return { ...state,
                user: action.data,
            };
        }
        case UserActionTypes.GET_USER_DATA: {
            return user;
        }
        default:
            return state;
    };
}