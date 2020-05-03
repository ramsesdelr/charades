<?php

namespace App\Http\Controllers;

use App\Matches;
use App\UsersMatch;
use App\Events\AddScore;
use App\Mail\InviteUserToMatch;
use Illuminate\Support\Facades\Mail;
use App\Repositories\UsersMatchRepository;
use Illuminate\Http\Request;

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

            Mail::to($request->get('email'))->send(new InviteUserToMatch($match));
            return [
                'status'=> 200, 
                'message'=> 'User invited'
            ];

        } catch (\Exception $e) {
            return [
                'status'=> 400, 
                'message'=> $e->getMessage()
            ];
        }
    }

}
