<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Users;
use JWTFactory;
use JWTAuth;
use Validator;
use Response;
use App\Repositories\UsersMatchRepository;
use App\Events\AddPlayerToMatch;


class APIRegisterController extends Controller
{
    public function register(Request $request, UsersMatchRepository $usersMatchRepo)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255|unique:users',
            'name' => 'required',
            'password'=> 'required',
            'phone'=> 'required|unique:users',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()]);
        }
        $user_data = Users::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => bcrypt($request->get('password')),
            'phone' => $request->get('phone'),
        ]);
        
        // $user = Users::first();
        
        if($request->get('match_id') != '') {
            $newPlayer = $usersMatchRepo->addUserToMatch(base64_decode($request->get('match_id')), $user_data->id);
            event(new AddPlayerToMatch($newPlayer));
        }
        $token = JWTAuth::fromUser($user_data);
        return response()->json(compact('token', 'user_data'));

    }
}