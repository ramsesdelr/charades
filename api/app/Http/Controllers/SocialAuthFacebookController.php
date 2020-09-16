<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Socialite;
use App\Services\SocialFacebookAccountService;
use JWTAuth;
class SocialAuthFacebookController extends Controller
{
    /**
     * Create a redirect method to facebook api.
     *
     * @return void
     */
    public function redirect() {
        return Socialite::driver('facebook')->redirect();
    }

    /**
     * Return a callback method from facebook api.
     * * @param  \Illuminate\Http\Request  $request
     * @return callback URL from facebook
     */
    public function callback(SocialFacebookAccountService $service, Request $request) {
        $user_data = $service->createOrGetUser($request->all());
        $token = auth()->login($user_data);
        return response()->json(compact('token', 'user_data'));
    }
}
