import React from 'react';
import { Link } from 'react-router-dom';
import { usersService } from './../../services/users.service';
import { matchesService } from './../../services//matches.service';
import { connect } from 'react-redux';

import LastMatch from './LastMatch';

class RecentMatches extends React.Component {
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
			<section className="container">
				<p className="title--sub-dashboard mb-2">Welcome to the fun</p>
				 <div className="text-center">
					<Link to="/match/new" className="btn btn-new-match">Start a Match</Link>
				 </div>
					<LastMatch/>
					{recent_matches &&
						<div>
							<p className="title--sub-dashboard mt-4 mb-3">Match history</p>
							<div  className="recent-matches-container">
								<table className="table">
									<thead>
										<tr>
											<th scope="col">Last Match</th>
											<th scope="col">Winner</th>
											<th scope="col">Match Score</th>
											<th scope="col">Foe</th>
										</tr>
									</thead>
									<tbody>
									{recent_matches.map((match, index) => {
										return <tr key={index}>
												<td>{match.name}</td>
												<td>{match.winner}</td>
												<td>{match.score.you} / {match.score.opponent}</td>
												<td>{match.vs_player}</td>
											</tr>											
									})
								}
										
									</tbody>					
								</table>
							</div>
						</div>
					}			
			</section>
		);
	}
}

export default connect(undefined, undefined)(RecentMatches);
