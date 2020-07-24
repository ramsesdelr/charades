<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use JWTFactory;
use JWTAuth;
use App\Users;
use App\Events\AddPlayerToMatch;
use App\Repositories\UsersMatchRepository;
use Illuminate\Support\Facades\Auth;


class APILoginController extends Controller
{   
    /**
     * Log in the current user
     * @param \Illuminate\Http\Request  $request
     * @param App\Repositories\UsersMatchRepository  $usersMatchRepo
     * @return string
     */
    public function login(Request $request,  UsersMatchRepository $usersMatchRepo) {
        
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password'=> 'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors());
        }
        $credentials =  $request->only('email', 'password');

        try {
            if (! $token = auth()->attempt($credentials)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'The user was not authenticated, please contact your website\'s administrator'], 500);
        }
        $user_data = Auth::user($token);
        
        if($request->get('match_id') != '') {
            $newPlayer = $usersMatchRepo->addUserToMatch(base64_decode($request->get('match_id')), $user_data->id);
            event(new AddPlayerToMatch($newPlayer));
        }
        
        return response()->json(compact('token', 'user_data'));
    }

    /**
     * Check if the token has expired and assign a new one
     * @return boolean 
     */
    function refreshToken() {
  
        $token = JWTAuth::getToken();
        if(!$token){
            return response()->json(['error' => 'Token not provided to renew'], 500);
        }
        try {
           $token =  auth()->refresh();
        } catch(\Tymon\JWTAuth\Exceptions\JWTException $e){
            return response()->json(['error' => 'The token is invalid'], 500);

        }catch (\Tymon\JWTAuth\Exceptions\TokenBlacklistedException $e) {
            return response()->json(['error' => 'The user was not authenticated, please contact your website\'s administrator'], 500);

        }
        return response()->json(compact('token'));
    }


}