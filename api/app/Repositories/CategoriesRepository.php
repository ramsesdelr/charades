<?php
namespace App\Repositories;
use App\Categories;
use Illuminate\Support\Facades\Auth;

class CategoriesRepository 
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
        return Categories::create($request->all());
    }

    /**
     * Get Categories by ID
     * @param integer $id
     * @return array
     */
    public function show($id){
    	return Categories::find($id);
    }

     /**
     * Update Categories 
     * @param integer $id
     * @return array
     */
    public function update($id, $request) {

        if(Categories::find($id)->update($request->all())){
        	return response()->json(['response' => [
	            'status' => 200,
	            'message' => 'Category was successfully updated',
        	]]);
        }
    }

    /**
     * Update Categories 
     * @param integer $id
     * @return array
     */
    public function delete($id) {

        if(Categories::find($id)->delete()) {
            return response()->json(['response' => [
                'status' => 200,
                'message' => 'Category was deleted.',
            ]]);
        }
    }
}