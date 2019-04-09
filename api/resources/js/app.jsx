import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { Home } from './components/Home';
import { LoginForm } from './components/LoginForm';

class App extends React.Component {
	render() {
		return (
				<div className="container">
					<div className="col-sm-8 col-sm-offset-2">
						<Router>
							<div>
								<PrivateRoute exact path="/" component={Home} />
								<Route path="/login" component={LoginForm} />
							</div>
						</Router>
					</div>
				</div>
		);
	}
}

export { App };