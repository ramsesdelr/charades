import * as UserActionTypes from '../actiontypes/users.js';

export const loginUser = (data) => {
    return {
        type: UserActionTypes.LOGIN_USER,
        data: data
    };
};