<?php
namespace App\Repositories;
use App\Matches;
use App\UsersMatch;
use App\Users;
use Illuminate\Support\Facades\Auth;
use JWTAuth;
use App\Events\PlayerTurn;


class MatchesRepository 
{
	/**
	 * Create a new Match
	 * @param POST $request
	 * @return array
	 * 
	 *  */
    public function create(array $request)
    {   

	    if (Users::find($request['users_id'])) {

	        $newMatch = Matches::create([
	            'users_id' => $request['users_id'],
	            'name' => $request['name'],
                'categories_id' => $request['categories_id'],
                'current_player'=> $request['users_id']
            ]);
            
            UsersMatch::create([
                'matches_id' => $newMatch->id,
                'users_id' => $request['users_id']
            ]);

            return response()->json($newMatch, 201);

	    } else {
	    	return response()->json(['response' => [
	            'status' => 400,
	            'message' => 'The user does not exist: '. $request['users_id'],
        	]]);
	    }
    }

    /**
     * Return all players from the match if the current player belongs to it
     * @param Object $match_id
     * @return array
     */
    public function show($match_id) {

        $token = JWTAuth::getToken();
        $user_data = Auth::user($token);
        $curent_match = [];

        $match_users =  UsersMatch::where('matches_id',$match_id)->get();

        if(isset($match_users) > 0) {      
            
            foreach($match_users as $match) {
                if($match->users_id == $user_data->id) {
                    
                    $players = $this->fetchPlayers($match_id); 
                    
                    $curent_match = [
                        'match_info' => Matches::find($match_id),
                        'players' => $players
                    ];
                    
                    return response()->json($curent_match, 200);
                    break;
                }
            }
        } 

        return response()->json(['response' => [
            'status' => 400,
            'message' => 'The current user does not belong to this match',
        ]]);

    }

     /**
     * Update Matches 
     * @param integer $matchId
     * @return string
     */
    public function update($matchId, $request) {
    	
        if(Matches::find($matchId)->update($request->all())){
        	return response()->json('Match was successfully updated!');
        }
    }

	 /**
	 * Delete a Match 
	 * @param integer $id
	 * @return string
	 */
    public function delete($id) {
        $match = Matches::find($id);
        if($match) {
            $match->delete();
            return response()->json([
                'status'=> 200,
                'message' => 'Match was deleted'
            ], 200);
        }
        return response()->json([
            'status' => 400,
            'data' => 'This match does not exist'
        ],400);
    }

    /**
     * Get all players from a match
     * @param integer $match_id
     * @return array $match_players
     */
    public function fetchPlayers($match_id) {

        $players = UsersMatch::distinct('users_id')->where('matches_id',$match_id)->get();
        $match_players = [];
        foreach($players as $key => $player) {
            $match_players[$key] = $player->user[0];
            $match_players[$key]['score'] = $player->score;
        }
        return $match_players;
    }

    /**
     * Update winner for a finished match
     * @param integer $match_id
     * @return string
     */
    public function addWinner($match_id) {
        $winner_query = UsersMatch::select('users_id')->where('matches_id', $match_id)->orderBy('score','desc')->first();
        $update_winner = Matches::where('id', $match_id)->update(['winner_id' => $winner_query->users_id]);
        if($update_winner) {
        	return response()->json([
                'status' => 200,
                'winnder_id' => $winner_query->users_id
            ]);
        }
    }
    /**
     * Return Matches results by user id
     * @param int $user_id
     * @return string
     */
    public function getMatchesByUserId($user_id) {
        $finished_matches = Matches::whereNotNull('winner_id')->where('users_id', $user_id)->orderBy('id', 'DESC')->take(10)->get();
        $matches = [];
        foreach($finished_matches as $match) {
            $opponent = UsersMatch::where('matches_id', $match->id)->where('users_id','!=', $user_id)->first();
            $matches[] = [
                'name' => $match->name,
                'winner' => $match->user->name,
                'score'=> $this->matchScores($match->id, $user_id),
                'vs_player' => $opponent->user[0]->name ?? 'Unknown',
                'category' => $match->category->title
            ];
        }
        return response()->json([
            'status' => 200,
            'data' => $matches
        ],200);
    }

    /**
     * Select Match scoring from a previous match
     * @param int $match_id
     * @return string
     */
    public function matchScores($match_id, $user_id) {
        $user_score = UsersMatch::select('score')->where('matches_id', $match_id)->where('users_id', $user_id)->first();
        $oponent_score = UsersMatch::select('score')->where('matches_id', $match_id)->where('users_id','!=', $user_id)->first();

        $match_result = ['you'=>'', 'opponent'=>''];
        if($oponent_score) {
            $match_result =  ['you' => $user_score->score, 'opponent'=> $oponent_score->score];    
        }
        return $match_result;     
    }

    /**
     * Update player turn to the Matches model
     * @param int $player_id
     * @param int $match_id
     * @return boolean
     */
    public function updatePlayerTurn($player_id, $match_id) {
        $update_current_player = Matches::where('id', $match_id)->update(['current_player'=> $player_id]);
        if($update_current_player) {
            event(new PlayerTurn($player_id));
            return true;
        }
        return false;
    }

    /**
     * Get the most recent match from an user
     * @param int $user_id
     * @param string
     */
    public function getLastMatchByUserId($user_id) {
        
        $last_match = Matches::whereNotNull('winner_id')->where('users_id', $user_id)->orderBy('id', 'DESC')->first();
        if(!$last_match) {
            return;
        }
        $opponent = UsersMatch::where('matches_id', $last_match->id)->where('users_id','!=', $user_id)->first();

        return response()->json([
            'name' => $last_match->name ,
            'winner' => $last_match->user->name ?? '',
            'score'=> $this->matchScores($last_match->id, $user_id),
            'vs_player' => $opponent->user[0]->name ?? 'Unknown',
            'category' => $last_match->category->title
        ]);
    }
    
}