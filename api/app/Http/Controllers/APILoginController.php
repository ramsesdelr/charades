<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use JWTFactory;
use JWTAuth;
use App\User;
use App\Events\AddPlayerToMatch;
use App\Repositories\UsersMatchRepository;
use Illuminate\Support\Facades\Auth;

class APILoginController extends Controller
{
    public function login(Request $request,  UsersMatchRepository $usersMatchRepo)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password'=> 'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors());
        }
        $credentials = $request->only('email', 'password');
        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credenials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'The user was not authenticated, please contact your website\'s administrator'], 500);
        }

        $user_data = Auth::user($token);
                
        if($request->get('match_id') != '') {
            $newPlayer = $usersMatchRepo->addUserToMatch($request->get('match_id'), $user_data->id);
            event(new AddPlayerToMatch($newPlayer));
        }
        
        return response()->json(compact('token', 'user_data'));
    }
}