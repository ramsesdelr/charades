import { createStore, combineReducers } from 'redux';
import usersReducer from '../reducers/usersReducer';
import matchesReducer from '../reducers/matchesReducer';

const reducer = combineReducers({
    match: matchesReducer,
    user: usersReducer,
});


export default createStore(
    reducer,  
    undefined,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);