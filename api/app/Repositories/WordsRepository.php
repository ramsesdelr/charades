<?php
namespace App\Repositories;
use App\Words;
use App\Users;
use Doctrine\Inflector\Rules\Word;
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
   

        if (Users::find($request['users_id'])) {
            $wordExists = Words::where('title', $request['title'])->get();
            if(count($wordExists) > 0) {
                return response()->json(['response' => [
                    'status' => 400,
                    'message' => 'This word already exist',
                ]]);
            }
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
     * @param integer $used_words
     * @return array
     */
    public function show($used_words){
	    return Words::whereNotIn('title', $used_words)->inRandomOrder()->value('title');
        
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