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

    }

    componentDidMount() {
        let match_info = matchesService.getMatch(this.props.match.params.match_id);
    }


    render() {
        const { loading } = this.state;
        return (
            <div>
                <div className="text-center mt-4"><h1 className="text-uppercase">Your Next Word Is</h1></div>
                <div className="match-box col-12 mt-4">
                    <div className="word-container">
                        <h1 className="word">Pickles</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-sm-12">
                        <div className="score-container">
                            <div className="current-score">
                                0
                            </div>
                            <div className="player-title">
                                James Bond
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-12">
                        <div className="score-container">
                            <div className="current-score">
                                0
                        </div>
                            <div className="player-title">
                                Cristian Casablanca
                        </div>
                        </div>
                    </div>
                </div>
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
