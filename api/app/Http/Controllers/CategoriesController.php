<?php

namespace App\Http\Controllers;

use App\Categories;
use Illuminate\Http\Request;
use App\Repositories\CategoriesRepository;

class CategoriesController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, CategoriesRepository $categoriesRepo)
    {
        try {
          return $categoriesRepo->create($request);
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
     * @param  \App\CategoriesRepository  $categoriesRepo
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id, CategoriesRepository $categoriesRepo)
    {
        try {
          return $categoriesRepo->show($id);
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
     * @param  \App\CategoriesRepository  $categoriesRepo
     * @param   $id
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $request, CategoriesRepository $categoriesRepo)
    {
        try {
          return $categoriesRepo->update($id, $request);
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
     * @param  \App\Categories  $categories
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, CategoriesRepository $categoriesRepo)
    {
        try {
          return $categoriesRepo->delete($id);
        } catch (\Exception $e) {
            return [
                'status'=> 400, 
                'message'=> $e->getMessage()
            ];
        }
    }
}
