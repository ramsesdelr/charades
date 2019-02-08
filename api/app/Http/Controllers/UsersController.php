<?php

namespace App\Http\Controllers;

use App\Users;
use Illuminate\Http\Request;
use App\Repositories\UsersRepository;


class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Users::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\UsersRepository  $usersRepo
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, UsersRepository $usersRepo)
    {
       try {
          return $usersRepo->create($request);
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
     * @param   $id
     * @return \Illuminate\Http\Response
     */
    public function show($id, UsersRepository $usersRepo)
    {
         try {
          return $usersRepo->show($id);
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
     * @param  \App\UsersRepository  $usersRepo
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $request, UsersRepository $usersRepo)
    {
        try {
          return $usersRepo->update($id, $request->all());
        } catch (\Exception $e) {
            return [
                'status'=> 400, 
                'message'=> $e->getMessage()
            ];
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        //
    }
}
