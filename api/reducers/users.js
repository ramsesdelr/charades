import * as UserActionTypes from '../actiontypes/users.js';

const initialState = {
    user: []
};

export default function usersReducer(state = initialState, action) {
    switch(action.type) {
        case UserActionTypes.LOGIN_USER: {
            state.user.push({ 
                id: action.data.id,
                email: action.data.email,
                name: action.data.name
            });
            return state;
        }
        default:
            return state;
    };
}