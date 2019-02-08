<?php
namespace App\Repositories;
use App\Users;
use Illuminate\Support\Facades\Auth;

class UsersRepository 
{
	/**
	 * Create a new User
	 * @param POST $request
	 * @return array
	 * 
	 *  */
    public function create($request)
    {   
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|unique:users',
            'phone' => 'required|unique:users',
        ]);

       $requestdata = $request->all();

        if($request['password'] != $request['password_c']) {
            return response()->json(['response' => [
                'status' => 400,
                'message' => 'Passwords do not match',
            ]]);
        }
       $requestdata['password'] = bcrypt($requestdata['password']);
	   return Users::create($requestdata);
    }

    /**
     * Get Users by ID
     * @param integer $id
     * @return array
     */
    public function show($id){
    	return Users::find($id);
    }

     /**
     * Update User 
     * @param integer $id
     * @return array
     */
    public function update($id, $request) {
        if(array_key_exists('password', $request)) {
            if($request['password'] != $request['password_c']) {
                return response()->json(['response' => [
                    'status' => 400,
                    'message' => 'Passwords do not match',
                ]]);
            }
        }
    	
        if(Users::find($id)->update($request)){
        	return response()->json(['response' => [
	            'status' => 200,
	            'message' => 'User was successfully updated',
        	]]);
        }
    }
}