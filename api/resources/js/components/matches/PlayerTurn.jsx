import React from 'react';
import { matchesService } from '../../services/matches.service'
import { Modal, Button , Alert} from 'react-bootstrap';

class PlayerTurn extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            current_player: 0,
            players: props.players,
            player_id: props.player_id,
            match_started: false,
            time:80,
            display_match_timer: false,
            start_match_timer:5,
        };
        const TURN_TIME = 80;
        
    }

    componentDidMount() {
        const pusher = new Pusher(process.env.MIX_PUSHER_APP_KEY, {
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            forceTLS: true
        });

        const channel = pusher.subscribe('scoring-channel');
        channel.bind('current-player', data => {
            if(data && data.current_player) {
                let player_index = matchesService.getplayerIndex(data.current_player, this.props.players);
                this.setState({ current_player: player_index });
                
            } 
        });
        
        this.setState({ current_player: matchesService.getplayerIndex(this.props.match.current_player, this.props.players) });
    }

    prepareMatchStart(player_id) {
        this.setState({display_match_timer:true});
        let pre_match_timer = setInterval(() => {

            this.setState({
                start_match_timer: this.state.start_match_timer - 1
            });
            if (this.state.start_match_timer == 0) {
                clearInterval(pre_match_timer);
                this.startMatch(player_id)
                 this.setState({
                    start_match_timer: 5,
                    display_match_timer: false
                 });
            }
        }, 1000);
    }

    startMatch(player_id) {
        this.setState({ match_started: true });

        matchesService.notifyPlayerMatchStarted(player_id);

        let timer = setInterval(() => {
            this.setState({
                time: this.state.time - 1
            });
            if (this.state.time == 0) {
                clearInterval(timer);
                this.setState({ match_started: false, time: this.TURN_TIME});
                matchesService.notifyPlayerMatchStopped(player_id);
            }
        }, 1000);
    }
 
    render() {

        const { current_player, player_id, match_started, time, start_match_timer, display_match_timer } = this.state;
        const renderStartMatchButton = () => {
            if(match_started === false && player_id == this.props.players[current_player].id && this.props.players.length > 1) {
                return <div className="d-flex flex-column align-items-center">
                        <button className="btn btn-new-match" onClick={this.prepareMatchStart.bind(this, player_id)}>Start</button>
                    </div>
            }
        };

    
        return (
            <aside className="container-fluid">
                {this.props.players.length > 0  && match_started == false &&
                    <div>
                        {/* <div>It's {this.props.players[current_player].name} turn</div> */}
                    </div>
                }
                {renderStartMatchButton()}
                {match_started &&
                    <div id="match_timer">{time}</div>
                }
                <Modal show={display_match_timer}>
                    <Modal.Body>
                        <h3>Get Ready...</h3>
                        <h2>Your turn is starting in <span className="h3-title">{start_match_timer}</span></h2>
                    </Modal.Body> 
                </Modal>    
            </aside>
        );
    }

}   

export default PlayerTurn;