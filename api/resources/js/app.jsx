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
				<div className="col-sm-12">
					<Router>
						<div>
							<PrivateRoute exact path="/" component={Home} />
							<Route path="/login" component={LoginForm} />
							<Route path="/logout" component={LoginForm} />
							<Route path="/register" component={RegisterForm} />
						</div>
					</Router>
				</div>
			</div>
		);
	}
}

export { App };