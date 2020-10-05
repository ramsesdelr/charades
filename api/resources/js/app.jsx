import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import  PrivateRoute  from './components/PrivateRoute';
import  Home  from './components/Home';
import 	LoginForm  from './components/LoginForm';
import  RegisterForm from './components/RegisterForm';
import  NewMatch from './components/matches/NewMatch';
import  Match from './components/matches/Match';
import ResetPassword from './components/ResetPassword';
import RecentMatches from './components/matches/RecentMatches';
import { usersService } from './services/users.service';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './bootstrap';
class App extends React.Component {
	constructor(props) {
		super(props); 
		let user = JSON.parse(localStorage.getItem('user'));
		this.state = {
			user: user,
		}
	}

	userLogOut () {
		usersService.logOut();
	}

	render() {
		const {user} = this.state
		return (
			<header>
				<div className="container-fluid">
						<Router>
							<PrivateRoute exact path="/" component={Home} />
							<PrivateRoute  path="/home" component={Home} />
							<PrivateRoute  path="/matches/recent" component={RecentMatches} />
							<PrivateRoute exact path="/match/new" component={NewMatch} />
							<PrivateRoute exact path="/current_match/:match_id" component={Match} />
							<Route path="/logout" component={LoginForm} />
							<Route path="/register/:match_id?" component={RegisterForm} />
							<Route path="/login/:match_id?" component={LoginForm} />
							<Route path="/forgot-password" component={ResetPassword} />
						</Router>
						
				</div>
			</header>
		);
	}
}

export { App };