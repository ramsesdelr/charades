<?php

namespace App\Http\Controllers;

use App\Matches;
use App\Users;
use App\Repositories\MatchesRepository;
use Illuminate\Http\Request;
use JWTAuth;

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
}
