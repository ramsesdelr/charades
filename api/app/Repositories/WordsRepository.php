<?php
namespace App\Repositories;
use App\Words;
use App\Users;
use Illuminate\Support\Facades\Auth;

class WordsRepository 
{
	/**
	 * Create a new Category
	 * @param POST $request
	 * @return array
	 * 
	 *  */
    public function create($request)
    {   
        $validatedData = $request->validate([
            'title' => 'required|max:255',
        ]);

        if (Users::find($request['users_id'])) {
            return Words::create([
                'users_id' => $request['users_id'],
                'title' => $request['title'],
                'categories_id' => $request['categories_id'],
            ]);
        } else {
            return response()->json(['response' => [
                'status' => 400,
                'message' => 'The user does not exist',
            ]]);
        }
    }

    /**
     * Get Words by ID
     * @param integer $id
     * @return array
     */
    public function show($id){
    	return Words::find($id);
    }

     /**
     * Update Words 
     * @param integer $id
     * @return array
     */
    public function update($id, $request) {

        if(Words::find($id)->update($request->all())){
        	return response()->json(['response' => [
	            'status' => 200,
	            'message' => 'Word was successfully updated',
        	]]);
        }
    }

    /**
     * Delete Words 
     * @param integer $id
     * @return array
     */
    public function delete($id) {

        if(Words::find($id)->delete()) {
            return response()->json(['response' => [
                'status' => 200,
                'message' => 'Category was deleted.',
            ]]);
        }
    }
}