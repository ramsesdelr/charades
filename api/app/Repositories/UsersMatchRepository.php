<?php

namespace App\Repositories;

use App\UsersMatch;
use App\Users;
use Illuminate\Support\Facades\Auth;

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
    public function addUserToMatch($match_id, $user_id) {

        $currentMatch = UsersMatch::insert([
            'matches_id' => $match_id,
            'users_id' => $user_id,
            'score' => 0
        ]);

        return $currentMatch;
    }
}
