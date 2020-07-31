<?php
namespace App\Repositories;
use App\Matches;
use App\UsersMatch;
use App\Users;
use Illuminate\Support\Facades\Auth;
use JWTAuth;

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
	 * Delete Match 
	 * @param integer $id
	 * @return string
	 */
    public function delete($id) {

        if(Matches::find($id)->delete()) {
            return response()->json('Match was deleted', 204);
        }
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
                'message' => 'Winner succesfully asigned'
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
            $oponent = UsersMatch::where('matches_id', $match->id)->where('users_id','!=', $user_id)->first();
            $matches[] = [
                'name' => $match->name,
                'winner' => $match->user->name,
                'score'=> $this->matchScores($match->id),
                'vs_player' => $oponent->user[0]->name
            ];
        }
        return response()->json([
            'status' => 200,
            'data' => $matches
        ]);
    }

    /**
     * Select Match scoring from a previous match
     * @param int $match_id
     * @return string
     */
    public function matchScores($match_id) {
        $match_score = UsersMatch::select('score')->where('matches_id', $match_id)->orderBy('score','desc')->get();
        $match_result = '';
        if(count($match_score) > 1 ) {
            $match_result = $match_score[0]->score . ' / ' . $match_score[1]->score;
        }
        return $match_result;     
    }
    
}