import React from 'react';
import { Link } from 'react-router-dom';
import { usersService } from '../services/users.service.js';
import { matchesService } from '../services/matches.service';
import { Tabs, Tab, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import NewWord from './layouts/dashboard/NewWord';
import UpdateSettings from './layouts/dashboard/UpdateSettings';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {  faChartPie } from '@fortawesome/free-solid-svg-icons'
library.add(fab,  faChartPie);
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			recent_matches: [],
			last_match: null
		}
	}

	async componentDidMount() {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.setState({user:this.user});
		await matchesService.getLastMatchByUser(this.user.user_data.id).then(response => this.setState({last_match : response}));
		await matchesService.getRecentMatchesByUser(this.user.user_data.id).then(response => this.setState({recent_matches : response.data}));
	}

	userLogOut () {
		usersService.logOut();
	}

	render() {
		const { recent_matches, user, last_match} = this.state;
		console.log(last_match);
		return (
			<main className="container">
				<p className="title--sub-dashboard mb-2">Welcome to the fun</p>
				 <div className="text-center">
					<Link to="/match/new" className="btn btn-new-match">Start a Match</Link>
				 </div>
				 <div className="row mt-4">
					 <div className="col-6">
						<p className="title--sub-dashboard mb-2">About last match</p>
					 </div>
					 <div className="col-6 text-right">
						<Link to="/">See all stats <FontAwesomeIcon icon="chart-pie"  /></Link>
					 </div>
				 </div>
			
				
					{last_match &&

							 <section className="d-flex">
								<div className="col-3 home--recent-match-block bg-green">
									<div className="home--stats-number">{last_match.score.you}</div>
									<div className="home--stats-description">Wins</div>
								</div>
								<div className="col-3 home--recent-match-block bg-blue">
									<div className="home--stats-number">{last_match.score.opponent}</div>
									<div className="home--stats-description">Losts</div>
								</div>
								<div className="col-3 home--recent-match-block bg-yellow">
									<div className="home--stats-number">{last_match.score.you}</div>
									<div className="home--stats-description">Score</div>
								</div>
								<div className="col-3 home--recent-match-block bg-dark-blue">
									<div className="home--stats-number">{last_match.vs_player.split(" ")[0]}</div>
									<div className="home--stats-description">Foe</div>
								</div>
							</section>
					}

					{recent_matches &&
						<section>
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
						</section>
					}	
							
						
					
			</main>
		);
	}
}

export default connect(undefined, undefined)(Home);
