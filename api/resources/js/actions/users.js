import * as UserActionTypes from '../actiontypes/users.js';

export const loginUser = (data) => {
    return {
        type: UserActionTypes.LOGIN_USER,
        data: data
    };
};

export const getUserData = () => {
    return {
        type: UserActionTypes.GET_USER_DATA,
    };
};
