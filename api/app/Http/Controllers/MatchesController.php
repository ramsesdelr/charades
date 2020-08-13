<?php

namespace App\Http\Controllers;

use App\Matches;
use App\Users;
use App\Repositories\MatchesRepository;
use Illuminate\Http\Request;
use JWTAuth;
use App\Events\NotifyPlayerMatchStarted;


class MatchesController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, MatchesRepository $matchesRepo)
    {
        try {
          return $matchesRepo->create($request->all());
        } catch (\Exception $e) {
            return [
                'status'=> 400, 
                'message'=> $e->getMessage()
            ];
        }
    }

    /**
     * Display the specified resource.
     * @param  integer $match_id
     * @param  \App\Matches  $matchesRepo
     * @return \Illuminate\Http\Response
     */
    public function show($match_id, MatchesRepository $matchesRepo)
    {
        
        try {
          return $matchesRepo->show($match_id);
        } catch (\Exception $e) {
            return [
                'status'=> 400, 
                'message'=> $e->getMessage()
            ];
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  $id
     * @param  \App\MatchesRepository  $matchesRepo
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $request, MatchesRepository $matchesRepo)
    {
        try {
          return $matchesRepo->update($id, $request);
        } catch (\Exception $e) {
            return [
                'status'=> 400, 
                'message'=> $e->getMessage()
            ];
        }
    }

    /**
     * Remove the specified resource
     *
     * @param  $id
     * @param  \App\MatchesRepository $matchesRepo
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, MatchesRepository $matchesRepo)
    {
        try {
          return $matchesRepo->delete($id);
        } catch (\Exception $e) {
            return [
                'status'=> 400, 
                'message'=> $e->getMessage()
            ];
        }
    }

    /**
     * Updates the current player on Turn
     * @param  \Illuminate\Http\Request  $request
     */
    public function updatePlayerTurn(Request $request,  MatchesRepository $matchesRepo) {
        try {
        $matchesRepo->updatePlayerTurn($request->get('player_id'), $request->get('match_id'));
        } catch (\Exception $e) {
              return [
                  'status'=> 400, 
                  'message'=> $e->getMessage()
              ];
          }
    }

    /**
     * Add winner to finished match
     * @param \Illuminate\Http\Request  $request
     */
    public function addWinner(Request $request, MatchesRepository $matchesRepo) {
        try {
            return $matchesRepo->addWinner($request->get('match_id'));
          } catch (\Exception $e) {
              return [
                  'status'=> 400, 
                  'message'=> $e->getMessage()
              ];
          }
    }
    /**
     * Return last 5 previous matches from an user
     * @param int $user_id
     * @return string
     */
    public function getRecentMatchesByuser($user_id, MatchesRepository $matchesRepo) {
        try {
            return $matchesRepo->getMatchesByUserId($user_id);
          } catch (\Exception $e) {
              return [
                  'status'=> 400, 
                  'message'=> $e->getMessage()
              ];
          }
    }
 
}
