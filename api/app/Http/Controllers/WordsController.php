<?php

namespace App\Http\Controllers;

use App\Words;
use Illuminate\Http\Request;
use App\Repositories\WordsRepository;

class WordsController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, WordsRepository $WordsRepo)
    {
        try {
          return $WordsRepo->create($request);
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
     * @param  \App\WordsRepository  $WordsRepo
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, WordsRepository $WordsRepo)
    {
        try {
          return $WordsRepo->show($request->get('used_words'), $request->get('category_id'));
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
     * @param  \App\WordsRepository  $WordsRepo
     * @param   $id
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $request, WordsRepository $WordsRepo)
    {
        try {
          return $wordsRepo->update($id, $request);
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
     * @param  \App\Words  $Words
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, WordsRepository $WordsRepo)
    {
        try {
          return $wordsRepo->delete($id);
        } catch (\Exception $e) {
            return [
                'status'=> 400, 
                'message'=> $e->getMessage()
            ];
        }
    }
}
