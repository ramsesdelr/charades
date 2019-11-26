import React from 'react';
import { render } from 'react-dom';
import store from '../../store/store';
import { loginUser } from './../../actions/users';
import { App } from './app';
let user = {
	name: 'Ram',
	email: 'ram@test.com',
	id: 12,
}
console.log('Before:', store.getState());
store.dispatch(loginUser(user));
console.log('After:', store.getState());  
render(
	<App />,
	document.getElementById('app')
);