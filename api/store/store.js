import { createStore } from 'redux';
import usersReducer from '../reducers/users.js';

export default createStore(
    usersReducer,  
    undefined,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );