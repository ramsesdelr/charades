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
            'name' => 'required|min:6',
            'password'=> 'required|min:6',
            'phone'=> 'required|unique:users',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()]);
        }
        $user_data = Users::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => $request->get('password'),
            'phone' => $request->get('phone'),
        ]);
        
        
        if($request->get('match_id') != '') {
            $newPlayer = $usersMatchRepo->addUserToMatch( $user_data->id, base64_decode($request->get('match_id')));
        }
        $token = auth()->login($user_data);
        return response()->json(compact('token', 'user_data'));

    }
}