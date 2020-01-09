import React from 'react';
import { matchesService } from '../../services/matches.service'
import { connect } from 'react-redux';


class Match extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            match_info:{},
            players: [],
        };

    }

    async getMatch(match_id) {

        try {
            let response = await matchesService.getMatch(match_id);
            this.setState( { match_info: response.data.match_info, players:response.data.players });

        }
        catch {
            this.setState({ loading: false });
        }
    
        
    }

    componentDidMount() {
        this.getMatch(this.props.match.params.match_id);
    }


    render() {
        const { loading, match_info, players } = this.state;
        const match_players = [];
        

        return (
            <div>
                <div className="text-center mt-4"><h1 className="text-uppercase">Your Next Word Is</h1></div>
                <div className="match-box col-12 mt-4">
                    <div className="word-container">
                        <h1 className="word">Pickles</h1>
                    </div>
                </div>
                <div className="row">
                {players.map((value, index) => {
                    return <div key={index} className="col-md-6 col-sm-12">
                    <div className="score-container">
                        <div className="current-score">
                            {value.score}
                        </div>
                        <div className="player-title">
                            {value.name}
                        </div>
                    </div>
                </div>
                })}
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
