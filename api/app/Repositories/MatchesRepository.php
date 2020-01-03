<?php
namespace App\Repositories;
use App\Matches;
use App\UsersMatch;
use App\Users;
use Illuminate\Support\Facades\Auth;

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
        $match_users =  Matches::find($match_id)->users;
        if(isset($match_users) > 0) {
            return response()->json($match_users, 200);
        }
        /* TODO: Validate that the current user exists in this $match_users array and then return the full list to Frontend, if not then return and unavailable match message */
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