<?php

namespace App\Http\Controllers;

use App\Matches;
use App\UsersMatch;
use App\Events\AddScore;
use App\Mail\InviteUserToMatch;
use Illuminate\Support\Facades\Mail;
use App\Repositories\UsersMatchRepository;
use Illuminate\Http\Request;
use Twilio\Rest\Client;

class UsersMatchController extends Controller
{

    /**
     * Adds one point to the current's user score
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addPointToScore(Request $request, UsersMatchRepository $usersMatchRepo) {
        try {
          $newScore =  $usersMatchRepo->addPointToUser($request->all());
        
          event(new AddScore($newScore));
          return $newScore;
        } catch (\Exception $e) {
            return [
                'status'=> 400, 
                'message'=> $e->getMessage()
            ];
        }
    }

    /**
     * Send invite to a new or existing user to join a match
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function inviteUser(Request $request) {
        try {
            $match = Matches::findOrFail($request->get('match_id'));
            $match->email = $request->get('email');
            $sid = env('TWILIO_ACCOUNT_ID');
            $token = env('TWILIO_AUTH_TOKEN');
            $client = new Client($sid, $token);
            $invite_url = env('APP_URL') . '/login/' . base64_encode($match->id);
            $field_exists = false;
            if ($request->get('phone') != '') {
                $field_exists = true;
                $client->messages->create(
                    // the number you'd like to send the message to
                    '+1' . $request->get('phone'),
                    [
                        // A Twilio phone number you purchased at twilio.com/console
                        'from' => '+15092603550',
                        // the body of the text message you'd like to send
                        'body' => 'Someone wants to play charades with you, join here: ' . $invite_url
                    ]
                );
            }

            if ($request->get('email') != '') {
                $field_exists = true;
                Mail::to($request->get('email'))->send(new InviteUserToMatch($match));
            }

            if($field_exists === true) {
                return response()->json(['message'=> 'User invited'], 200);
            } else {
                return response()->json(['message'=> 'Please insert an e-mail or phone number'], 400);
            }

        } catch (\Exception $e) {
            return response()->json(['message'=> $e->getMessage()], 400);
        }
    }

}
