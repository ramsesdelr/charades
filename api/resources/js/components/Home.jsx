import React from 'react';
import { Link } from 'react-router-dom';
import { usersService } from '../services/users.service.js';
import { matchesService } from '../services/matches.service';
import { Tabs, Tab, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import NewWord from './layouts/dashboard/NewWord';
import UpdateSettings from './layouts/dashboard/UpdateSettings';

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
			<div>
				 <div className="text-center">
					<Link to="/match/new" className="btn btn-new-match">Start a New Match</Link>
				 </div>
				<Tabs defaultActiveKey="matches" id="uncontrolled-tab-example">
				<Tab eventKey="matches" title="Matches">
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Last Match</th>
								<th>Winner</th>
								<th>Match Score</th>
								<th>VS Player</th>
							</tr>
						</thead>
						<tbody>
							{recent_matches.length > 0 &&
								recent_matches.map((match, index) => {
									return <tr key={index}>
										<td>{match.name}</td>
										<td>{match.winner}</td>
										<td>{match.score}</td>
										<td>{match.vs_player}</td>
									</tr>
								})
							}
						</tbody>
					</Table>
				</Tab>
				<Tab eventKey="settings" title="Settings">
					<UpdateSettings user_data={user} />
				</Tab>
				<Tab eventKey="words" title="Words">
					<NewWord/>
				</Tab>
				</Tabs>
			</div>
		);
	}
}

export default connect(undefined, undefined)(Home);
