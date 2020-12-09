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
            if($account->user->profile_img == '/profile_images/profile.jpg') {
                $this->updateUserImage($providerUser['accessToken'], $account->user);
            }
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
            $this->updateUserImage($providerUser['accessToken'], $user);


            return $user;
        }
    }

    public function updateUserImage(string $accessToken, Object $user) {
        $fb = new \Facebook\Facebook([
            'app_id' => env('FACEBOOK_APP_ID'),
            'app_secret' => env('FACEBOOK_APP_SECRET'),
            'default_graph_version' => env('FACEBOOK_DEFAULT_GRAPH_VERSION'),
            'default_access_token' =>  $accessToken, // optional
          ]);

          try {
            $requestPicture = $fb->get('/me/picture?redirect=false&height=150'); //getting user picture
            $picture = $requestPicture->getGraphUser();
          } catch(\Facebook\Exceptions\FacebookResponseException $e) {
            // When Graph returns an error
            echo 'Graph returned an error: ' . $e->getMessage();
            exit;
          } catch(\Facebook\Exceptions\FacebookSDKException $e) {
            // When validation fails or other local issues
            echo 'Facebook SDK returned an error: ' . $e->getMessage();
            exit;
          }
          Users::where(['id'=>$user->id])->update(['profile_img' => $picture['url']]);

    }
}
