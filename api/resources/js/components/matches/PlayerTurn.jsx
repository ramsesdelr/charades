import React from 'react';
import { matchesService } from '../../services/matches.service'
import { ArrowLeftCircle, ArrowRightCircle  } from 'react-bootstrap-icons';
class PlayerTurn extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            current_player: 0,
            players: props.players,
            player_id: props.player_id,
            match_started: false,
            time:10,
        };
        
    }

    componentDidMount() {
        const pusher = new Pusher('a9f6c879a24fcaac7c20', {
            cluster: 'us2',
            forceTLS: true
        });

        const channel = pusher.subscribe('scoring-channel');
        channel.bind('current-player', data => {
            if(data && data.current_player) {
                let player_index = this.getplayerIndex(data.current_player);
                this.setState({ current_player: player_index });
                
            } 
        });
        
        this.setState({ current_player: this.getplayerIndex(this.props.match.current_player) });
    }

    /**
     * Retrieve the player's index in the current match
     * @param {int} player_id 
     * @return {int} 
     */
    getplayerIndex(player_id) {
       let current_player_index = 0;
       this.props.players.map((player, index) => {
            
            if (player.id == player_id) {
                current_player_index = index;
            }
        });
        return current_player_index;
    }

    startMatch(player_id) {
        const TURN_TIME = 10;
        this.setState({ match_started: true });
        matchesService.notifyPlayerMatchStarted(player_id);

        let timer = setInterval(() => {
            this.setState({
                time: this.state.time - 1
            });
            if (this.state.time == 0) {
                clearInterval(timer);
                this.setState({ match_started: false, time: TURN_TIME});
                console.log(this.state);
                matchesService.notifyPlayerMatchStopped(player_id);
            }
        }, 1000);
    }
 
    render() {

        const { current_player, player_id, match_started, time } = this.state;
        const renderStartMatchButton = () => {
            if(match_started === false && player_id == this.props.players[current_player].id) {
                return <div className="d-flex flex-column align-items-center">
                        <button className="btn btn-new-match" onClick={this.startMatch.bind(this, player_id)}>Start</button>
                    </div>
            }
        };

    
        return (
            <div className="container-fluid">
                {this.props.players.length > 0  && match_started == false &&
                    <div>
                        <div>It's {this.props.players[current_player].name} turn</div>
                    </div>
                }
                {renderStartMatchButton()}
                {match_started &&
                    <div id="match_timer">{time}</div>
                }
                
            </div>
        );
    }

}   

export default PlayerTurn;