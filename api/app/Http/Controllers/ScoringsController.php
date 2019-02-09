<?php

namespace App\Http\Controllers;

use App\Scorings;
use App\Repositories\ScoringsRepository;
use Illuminate\Http\Request;

class ScoringsController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, ScoringsRepository $scoringsRepo)
    {
        try {
          return $scoringsRepo->create($request);
        } catch (\Exception $e) {
            return [
                'status'=> 400, 
                'message'=> $e->getMessage()
            ];
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ScoringsRepository  $scoringsRepo
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id, ScoringsRepository $scoringsRepo)
    {
        try {
          return $scoringsRepo->show($id);
        } catch (\Exception $e) {
            return [
                'status'=> 400, 
                'message'=> $e->getMessage()
            ];
        }
    }


    /**
     * Update the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ScoringsRepository  $scoringsRepo
     * @param   $id
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $request, ScoringsRepository $scoringsRepo)
    {
        try {
          return $scoringsRepo->update($id, $request);
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
     * @param  \App\Scorings  $ScoringsRepo
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, ScoringsRepository $scoringsRepo)
    {
        try {
          return $scoringsRepo->delete($id);
        } catch (\Exception $e) {
            return [
                'status'=> 400, 
                'message'=> $e->getMessage()
            ];
        }
    }
}