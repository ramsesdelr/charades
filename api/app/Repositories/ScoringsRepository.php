<?php
namespace App\Repositories;

use App\Matches;
use App\Words;
use App\Users;
use App\Scorings;
use Illuminate\Support\Facades\Auth;

class ScoringsRepository 
{
	/**
	 * Create a new Score
	 * @param POST $request
	 * @return array
	 * 
	 *  */
    public function create($request)
    {   
        $validatedData = $request->validate([
            'matches_id' => 'required',
            'words_id' => 'required',
            'users_id' => 'required',
        ]);

        $selectedMatch = Matches::find($request->matches_id);
        $selectedWord  = Words::find($request->words_id);
        $selectedUser  = Users::find($request->users_id);

        if( !$selectedUser || !$selectedWord || !$selectedUser) {
            return response()->json(['response' => [
                'status' => 200,
                'message' => 'One or more values does not exist.',
            ]]);
        }
     
        return Scorings::create($request->all());
    }

    /**
     * Get Scorings by ID
     * @param integer $id
     * @return array
     */
    public function show($id){
    	return Scorings::find($id);
    }

     /**
     * Update Scorings 
     * @param integer $id
     * @return array
     */
    public function update($id, $request) {

        if(Scorings::find($id)->update($request->all())){
        	return response()->json(['response' => [
	            'status' => 200,
	            'message' => 'Score was successfully updated',
        	]]);
        }
    }

    /**
     * Delete a Score 
     * @param integer $id
     * @return array
     */
    public function delete($id) {

        if($currentCategory = Scorings::find($id)) {
            $currentCategory->delete();
            return response()->json(['response' => [
                'status' => 200,
                'message' => 'Score was deleted.',
            ]]);
        } else {
              return response()->json(['response' => [
                'status' => 400,
                'message' => 'Score does not exist.',
            ]]);
        }
    }
}