import React from 'react';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: '',
		}
	}

	componentDidMount() {
		this.setState({token: localStorage.getItem('token')});
	}

	render() {
		return (
			<div>
				<h1>Congrats, you managed to log in!</h1>
			</div>
		);
	}
}

export { Home };