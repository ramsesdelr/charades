<?php

namespace App\Repositories;

use App\UsersMatch;
use App\Users;
use Illuminate\Support\Facades\Auth;
use App\Events\AddPlayerToMatch;

class UsersMatchRepository {
    /**
     * Create a new Score
     * @param POST $request
     * @return array
     * 
     *  */
    public function addPointToUser($request)  {
         
        $usersMatch = UsersMatch::where('users_id', $request['users_id'])
            ->where('matches_id', $request['matches_id'])->first();
        $usersMatch->increment('score');
        return $usersMatch;

    }
    /**
     * Add new player to a current match
     * @param integer $user_id
     * @param integer $match_id
     * @return void
     */
    public function addUserToMatch($user_id, $match_id) {
        // check if match is full before adding a new player
        $playersInMatch = UsersMatch::where('matches_id', $match_id)->get();

        $playerExists = UsersMatch::where('matches_id', $match_id)->where('users_id',$user_id)->get();

        if($playersInMatch->count() > 1) {
            
            if($playerExists->count() > 0) {
                
                return response()->json(['response' => [
                    'status' => 200,
                    'message' => 'This match already has 2 players',
                ]]);
            }

            return response()->json(['response' => [
	            'status' => 400,
	            'message' => 'This invitation is no longer valid.',
        	]]);
           
        }

        $currentMatch = UsersMatch::insert([
            'matches_id' => $match_id,
            'users_id' => $user_id,
            'score' => 0
        ]);

        if($currentMatch) {
            event(new AddPlayerToMatch);
            return response()->json(['response' => [
                'status' => 200,
                'message' => 'Player added to match!',
            ]]);
        }

        return $currentMatch;
    }
}
