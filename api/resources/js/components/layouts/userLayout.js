import React from 'react';
import { usersService } from '../../services/users.service';

class UserLayout extends React.Component {
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
				 	<div className="user-login">
						<h5>Hi there, {user.user_data.name}!</h5>
						<a href="#" onClick={this.userLogOut} >Logout</a>
					</div>
				 }
				
			</div>
		);
	}
}

export { UserLayout };