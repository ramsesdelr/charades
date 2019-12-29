import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import  PrivateRoute  from './components/PrivateRoute';
import  Home  from './components/Home';
import 	LoginForm  from './components/LoginForm';
import  {RegisterForm} from './components/RegisterForm';
import  NewMatch from './components/matches/NewMatch';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
	render() {
		return (
			<div className="container">
					<Router>
						<PrivateRoute exact path="/" component={Home} />
						<PrivateRoute  path="/home" component={Home} />
						<PrivateRoute exact path="/match/new" component={NewMatch} />
						<PrivateRoute path="/match/:match_id" component={Match} />
						<Route path="/logout" component={LoginForm} />
						<Route path="/register/:match_id?" component={RegisterForm} />
						<Route path="/login" component={LoginForm} />
					</Router>
			</div>
		);
	}
}

export { App };