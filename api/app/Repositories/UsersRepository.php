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

        if($request['password'] != $request['password_validate']) {
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
            if($request['password'] != $request['password_validate']) {
                return response()->json(['response' => [
                    'status' => 400,
                    'message' => 'Passwords do not match',
                ]]);
            }
        }

        if(self::phoneExist($request['phone'], $request['users_id'])) {
            return response()->json(['response' => [
                'status' => 400,
                'message' => 'This phone is currently in use' ,
            ]]); 
        }
    	
        if(Users::find($id)->update($request)){
        	return response()->json(['response' => [
	            'status' => 200,
	            'message' => 'User was successfully updated!',
        	]]);
        }
    }

    /**
     * Check if the phone number exist on a different user (phone number should be unique)
     * @param string $phone
     * @param int $user_id
     * @return boolean
     */
    public static function phoneExist($phone, $user_id) {
        if(count(Users::where('phone', $phone)->where('id','!=', $user_id)->get()) > 0) {
            return true;
        }
        return false;
    }
    /**
     * Reset the user's password and send it through email
     * @param array $user_data
     * @return void
     */
    public function resetPassword($user_data) {
        $random_password = self::randomPassword();
        $updated_users = Users::where('email', $user_data['email'])->update(['password' => bcrypt($random_password)]);
        
        if($updated_users > 0) {
            return $random_password;
        }
        return false;
    }

    /**
     * Generates a random password
     * Function taken from https://stackoverflow.com/questions/6101956/generating-a-random-password-in-php
     * @return string
     */
    public static function randomPassword() {
        $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        $pass = []; //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }

}