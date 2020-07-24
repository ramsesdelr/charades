import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import  PrivateRoute  from './components/PrivateRoute';
import  Home  from './components/Home';
import 	LoginForm  from './components/LoginForm';
import  RegisterForm from './components/RegisterForm';
import  NewMatch from './components/matches/NewMatch';
import  Match from './components/matches/Match';
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
			<div>
				<nav className="navbar sticky-top navbar-red">
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#menu-content" aria-controls="menu-content" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
					</button>
					<a className="navbar-brand text-center" href="#">Charades Online</a>
				</nav>
				<div className="collapse" id="menu-content">
					<div className="bg-red p-4">
						<ul className="navbar-nav">
							{user != null  ? (
								<li className="nav-item active">
									<a className="nav-link" href="/login" onClick={this.userLogOut}>Logout</a>
								</li>
								 ) : (
									<li className="nav-item active">
									<a className="nav-link" href="/login">Login</a>
								</li>
								)}
							
							<li className="nav-item">
							<a className="nav-link" href="/register">Register</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">About</a>
							</li>
							<li className="nav-item">
								<a className="nav-link disabled" href="#">Tutorial</a>
							</li>
						</ul>
					</div>
				</div>
				
				<div className="container-fluid">
						<Router>
							<PrivateRoute exact path="/" component={Home} />
							<PrivateRoute  path="/home" component={Home} />
							<PrivateRoute exact path="/match/new" component={NewMatch} />
							<PrivateRoute exact path="/current_match/:match_id" component={Match} />
							<Route path="/logout" component={LoginForm} />
							<Route path="/register/:match_id?" component={RegisterForm} />
							<Route path="/login/:match_id?" component={LoginForm} />
						</Router>
				</div>
			</div>
		);
	}
}

export { App };