import React from 'react';
import { usersService } from '../../services/users.service';
import { connect } from 'react-redux';
import * as UserActions from './../../actions/users';


class UserLayout extends React.Component {

	constructor(props) {
		super(props);
		this.userLogOut = this.userLogOut.bind(this)
	}

	userLogOut () {
		usersService.logOut();
		this.props.history.push("/");
	}
	render() {
		const { user } = this.props;
		
		return (
			<div>
				 {user && 
				 	<div className="user-login">
						<h5>Hi there, {user.name}!</h5>
						<a href="#" onClick={this.userLogOut} >Logout</a>
					</div>
				 }
				
			</div>
		);
	}
}

const mapStateToProps = state => (
	{
	  user: state.user,
	}
);

  
export default connect(mapStateToProps, UserActions)(UserLayout);