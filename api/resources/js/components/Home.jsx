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
			recent_matches: []
		}
	}

	componentDidMount() {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.setState({user:this.user});
		matchesService.getRecentMatchesByUser(this.user.user_data.id).then(response => this.setState({recent_matches : response.data}));
	}

	userLogOut () {
		usersService.logOut();
	}

	render() {
        const { recent_matches, user } = this.state;

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
						<Link  to="/">See all stats <FontAwesomeIcon icon="chart-pie"  /></Link>
					 </div>
				 </div>
				 <section className="d-flex">
					<div className="col-3 home--recent-match-block bg-green">
						<div className="home--stats-number">22</div>
						<div className="home--stats-description">Wins</div>
					</div>
					<div className="col-3 home--recent-match-block bg-blue">
						<div className="home--stats-number">13</div>
						<div className="home--stats-description">Losts</div>
					</div>
					<div className="col-3 home--recent-match-block bg-yellow">
						<div className="home--stats-number">100</div>
						<div className="home--stats-description">Score</div>
					</div>
					<div className="col-3 home--recent-match-block bg-dark-blue">
						<div className="home--stats-number">Anthy</div>
						<div className="home--stats-description">Foe</div>
					</div>
				 </section>
				

			</main>
		);
	}
}

export default connect(undefined, undefined)(Home);
