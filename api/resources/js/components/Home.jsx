import React from 'react';
import { Link } from 'react-router-dom';
import { usersService } from '../services/users.service.js';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: '',
		}
	}

	componentDidMount() {
		this.setState({token: localStorage.getItem('token')});
		usersService.getAll().then(users => console.log(users.data));
	}

	render() {
		return (
			<div>
				<h1>Congrats, you managed to log in!</h1>
				<Link to="/login">Logout</Link>
			</div>
		);
	}
}

export { Home };