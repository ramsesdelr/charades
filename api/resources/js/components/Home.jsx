import React from 'react';
import { Link } from 'react-router-dom';
import { usersService } from '../services/users.service.js';
import { Tabs, Tab, Table } from 'react-bootstrap';
import { connect } from 'react-redux';


class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
		}
	}

	componentDidMount() {
		usersService.getAll().then(users => console.log(users.data));
	}

	userLogOut () {
		usersService.logOut();
	}

	render() {
		const { user } = this.props;
		return (
			<div>
				 <div className="text-center">
					<Link to="/match/new" className="btn btn-new-match">Start a New Match {user.name}</Link>
				 </div>
				<Tabs defaultActiveKey="matches" id="uncontrolled-tab-example">
				<Tab eventKey="matches" title="Matches">
					<Table striped bordered hover>
						<thead>
							<tr>
							<th>Last Match</th>
							<th>W/L</th>
							<th>Match Score</th>
							<th>VS Player</th>
							</tr>
						</thead>
						<tbody>
							<tr>
							<td>Mark</td>
							<td>Otto</td>
							<td>@mdo</td>
							<td>@mdo</td>
							</tr>
							<tr>
							<td>Jacob</td>
							<td>Thornton</td>
							<td>@fat</td>
							<td>@fat</td>
							</tr>
						</tbody>
					</Table>
				</Tab>
				<Tab eventKey="settings" title="Settings">
					Tab 2
				</Tab>
				<Tab eventKey="words" title="Words">
					Tab 3
				</Tab>
				</Tabs>
			</div>
		);
	}
}

const mapStateToProps = state => (
	{
	  user: state.user,
	}
);


export default connect(mapStateToProps, undefined)(Home);
