import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { Home } from './components/Home';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';

class App extends React.Component {
	render() {
		return (
			<div className="container">
					<Router>
							<PrivateRoute  path="/home" component={Home} />
							<Route exact path="/" component={LoginForm} />
							<Route path="/logout" component={LoginForm} />
							<Route path="/register" component={RegisterForm} />
					</Router>
			</div>
		);
	}
}

export { App };