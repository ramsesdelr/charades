<?php
namespace App\Repositories;
use App\Matches;
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
     * @param integer $matchId
     * @return array
     */
    public function show($matchId){
    	return Matches::find($matchId);
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