import React from 'react';
import { usersService } from '../../services/users.service';
import { connect } from 'react-redux';
import * as UserActions from './../../actions/users';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {  faBars } from '@fortawesome/free-solid-svg-icons'
library.add(fab,  faBars);
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
		const username = user.name.split(" ");
		return (
			<div className="container">
				 {user && 
					<header className="row mt-5">
							<div className="col-6">
								<div className="d-flex align-items-center">
									<img src="images/profile.jpg" className="profile-container--image"></img><span className="title--main">{username[0]} </span>
								</div>
							</div>
							<div className="col-6 d-flex justify-content-end align-items-center">
								<div>
									<FontAwesomeIcon icon="bars" size="lg" />
								</div>
							</div>	
					</header>
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