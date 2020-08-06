<?php

namespace App\Http\Controllers;

use App\Users;
use Illuminate\Http\Request;
use App\Repositories\UsersRepository;
use App\Mail\ResetUserPassword;
use Illuminate\Support\Facades\Mail;


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

    /**
     * Reset and sent the user's a new password
     * @param \Illuminate\Http\Request  $request
     */
    public function resetPassword(Request $request, UsersRepository $usersRepo) {
        try {
            $new_password = $usersRepo->resetPassword($request->all());
            $user_data = [
                'email' => $request['email'],
                'password' => $new_password,
            ];

            Mail::to($request->get('email'))->send(new ResetUserPassword($user_data));

            return [
                'status'=> 200, 
                'message'=> 'Password changed'
            ];

          } catch (\Exception $e) {
              return [
                  'status'=> 400, 
                  'message'=> $e->getMessage()
              ];
          }
    }
}
