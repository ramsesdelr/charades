import React from 'react';
import { Link } from 'react-router-dom';
import { usersService } from '../services/users.service.js';
import { Tabs, Tab, Table } from 'react-bootstrap';

class Home extends React.Component {
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
				 <div className="text-center">
				 	<button className="btn btn-new-match">Start a New Match</button>
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

export { Home };