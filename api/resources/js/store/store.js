import { createStore, combineReducers } from 'redux';
import usersReducer from '../reducers/usersReducer';

const reducer = combineReducers({
    user: usersReducer,
});


export default createStore(
    reducer,  
    undefined,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);