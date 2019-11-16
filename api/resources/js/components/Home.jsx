import React from 'react';
import { Link } from 'react-router-dom';
import { usersService } from '../services/users.service.js';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
		}
	}

	componentDidMount() {
		this.setState({user: JSON.parse(localStorage.getItem('user'))});
	
		usersService.getAll().then(users => console.log(users.data));
	}

	userLogOut () {
		usersService.logOut();
	}

	render() {
		const { user } = this.state;
		return (
			<div>
				 {user.user_data && 
				 	<div>
						<h1>Congrats {user.user_data.name}, you managed to log in!</h1>
						<a href="#" onClick={this.userLogOut} >Logout</a>
					</div>
				 }
			</div>
		);
	}
}

export { Home };