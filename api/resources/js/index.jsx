import React from 'react';
import { render } from 'react-dom';
import store from './store/store';
import { loginUser } from './actions/users';
import { App } from './app';
import { Provider } from 'react-redux';

render(
	<Provider store={store}>
   		<App />
 	</Provider>,
	document.getElementById('app')
);