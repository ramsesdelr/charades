<?php

namespace App\Services;
use App\SocialFacebookAccount;
use App\Users;
use Laravel\Socialite\Contracts\User as ProviderUser;

class SocialFacebookAccountService
{
    
    public function createOrGetUser($providerUser) {
        $account = SocialFacebookAccount::whereProvider('facebook')
            ->whereProviderUserId($providerUser['userID'])
            ->first();

        if ($account) {
            return $account->user;
        } else {

            $account = new SocialFacebookAccount([
                'provider_user_id' => $providerUser['userID'],
                'provider' => 'facebook'
            ]);

            $user = Users::whereEmail($providerUser['email'])->first();

            if (!$user) {

                $user = Users::create([
                    'email' => $providerUser['email'],
                    'name' => $providerUser['name'],
                    'password' => md5(rand(1,10000)),
                ]);
            }
            $account->user()->associate($user);
            $account->save();

            return $user;
        }
    }
}