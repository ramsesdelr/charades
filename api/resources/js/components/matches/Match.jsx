import React from 'react';
import { matchesService } from '../../services/matches.service'
import { connect } from 'react-redux';


class Match extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            match_name: '',
            error: '',
            loading: false,
            user:{},
        };

        // this.getMatch = this.getMatch.bind(this);
    }

    componentDidMount() {
        let match_info = matchesService.getMatch(this.props.match.params.match_id);
    }


    render() {
        const {loading } = this.state;
        return (
            <div className="match-box col-12 mt-4">
                test

            </div>

        );
    }
}

const mapStateToProps = state => (
	{
	  user: state.user,
	}
);

export default connect(mapStateToProps, undefined)(Match);
