import React from 'react';
import { Link } from 'react-router-dom';
import { usersService } from '../services/users.service.js';
import { matchesService } from '../services/matches.service';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faUserFriends, faBook } from '@fortawesome/free-solid-svg-icons'
library.add(fab, faUserFriends, faBook);
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LastMatch from './matches/LastMatch';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			recent_matches: [],
		}
	}

	async componentDidMount() {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.setState({user:this.user});
		await matchesService.getRecentMatchesByUser(this.user.user_data.id).then(response => this.setState({recent_matches : response.data}));
	}

	userLogOut () {
		usersService.logOut();
	}

	render() {
		const { recent_matches, user} = this.state;

		return (
			<div>
				<section className="container">
					<p className="title--sub-dashboard mb-2">Welcome to the fun</p>
					<div className="text-center">
						<Link to="/match/new" className="btn btn-new-match">Start a Match</Link>
					</div>
						<LastMatch/>
					<p className="title--sub-dashboard mb-2">Expand your game</p>
					<div className="d-flex">
				
						<div className="col-6 text-center invite-friend-container  mr-2">
							<div className="text-center">
								<FontAwesomeIcon icon="user-friends" size="5x" />
								<div className="mt-1">Invite a Friend</div>
							</div>
						</div>
						<div className="col-6 text-center invite-friend-container">
							<div className="text-center">
								<FontAwesomeIcon icon="book" size="5x" />
								<div className="mt-1">Add Words</div>
							</div>
						</div>
					</div>
				</section>
				
			</div>
		);
	}
}

export default connect(undefined, undefined)(Home);
