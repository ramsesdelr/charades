import React from 'react';
import { usersService } from '../../services/users.service';
import { connect } from 'react-redux';
import * as UserActions from './../../actions/users';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {  faBars } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

library.add(fab,  faBars);
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class UserLayout extends React.Component {

	constructor(props) {
		super(props);
		this.userLogOut = this.userLogOut.bind(this);		
	}

	userLogOut () {
		usersService.logOut();
		this.props.history.push("/");
	}
	render() {

		if(this.props.match && this.props.match.params.match_id) {
			return  <div className="match--top text-center">
						<Link to="/home"><img src="/svg/charades-logo.svg" className="match--top--logo"></img></Link>
					</div>
		}

		const { user } = this.props;
		const username =  user ?  user.name.split(" ") : null;
		
		return (
			<div className="container">
				 {username && 
					<header className="row user-profile-container">
							<div className="col-6">
								<div className="d-flex align-items-center">
									<img src="/images/profile.jpg" className="profile-container--image"></img> 
									<Link to="/home"><span className="title--main">{username[0]} </span></Link>
								</div>
							</div>
							<div className="col-6 d-flex justify-content-end align-items-center">
								<div>
									<a data-toggle="collapse"  data-target="#menu-content" aria-controls="menu-content" aria-expanded="false">
										<FontAwesomeIcon icon="bars" size="lg" />
									</a>
								</div>
							</div>
							<nav className="collapse" id="menu-content">
								<div>
									<ul className="navbar-nav">
										<li className="nav-links active text-center">
											<a className="title--main" href="/home">Home</a>
										</li>
										<li className="nav-links text-center">
											<a className="title--main" href="/register">Register</a>
										</li>
										<li className="nav-links text-center">
											<a className="title--main" target="_blank" href="https://github.com/ramsesdelr/charades/">About</a>
										</li>
										<li className="nav-links text-center">
											<a className="title--main" href="/privacy">Privacy Policy</a>
										</li>
										{user != null  ? (
											
											<li className="nav-links--last active text-center">
												<a className="title--main" href="/login" onClick={this.userLogOut}>Logout</a>
											</li>
										
										) : (
											<li className="nav-links active text-center">
											<a className="title--main" href="/login">Login</a>
										</li>
										)}
									</ul>
								</div>
							</nav>	
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