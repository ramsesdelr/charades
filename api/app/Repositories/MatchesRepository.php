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
	            'password' => $request['password'],
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
     * Get Matches by ID
     * @param Object $match_id
     * @return array
     */
    public function show($match_id) {

        $token = JWTAuth::getToken();
        $user_data = Auth::user($token);

        $match_users =  Matches::find($match_id);

        if(isset($match_users) > 0) {      
            foreach($match_users->users as $match) {
                if($match->users_id == $user_data->id) {
                    
                    return response()->json($match_users->users, 200);
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
     * @return array
     */
    public function update($matchId, $request) {
    	
        if(Matches::find($matchId)->update($request->all())){
        	return response()->json('Match was successfully updated!');
        }
    }

	 /**
	 * Delete Match 
	 * @param integer $id
	 * @return array
	 */
    public function delete($id) {

        if(Matches::find($id)->delete()) {
            return response()->json('Match was deleted', 204);
        }
    }
    
}