<?php

use Illuminate\Http\Request;
use App\Users;
use App\Categories;
use App\Words;
use App\Matches;
use App\Scorings;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('jwt.auth')->get('user', function(Request $request) {
    return auth()->user();
});

Route::prefix('users')->group(function () {
	
	Route::middleware('jwt.auth')->get('/', function() {
		return Users::select('id','name','email','phone')->get();
	});
	Route::middleware('jwt.auth')->put('/{id}', 'UsersController@update');
	Route::middleware('jwt.auth')->get('/{id}', 'UsersController@show');
	Route::post('/register', 'APIRegisterController@register');
	Route::post('/login', 'APILoginController@login');
});


Route::group(['prefix'=> 'matches', 'middleware'=>'jwt.auth'],function () {
	Route::get('/', function() {
		return Matches::all();
	})->name('matches.all');;
	Route::get('/{id}', 'MatchesController@show')->name('matches.show');;
	Route::put('/{id}', 'MatchesController@update')->name('matches.update');;
	Route::post('/', 'MatchesController@store')->name('matches.store');
	Route::delete('/{id}', 'MatchesController@destroy')->name('matches.delete');
});

Route::get('words', function() {
	return Words::all();
});

Route::group(['prefix'=> 'categories', 'middleware'=>'jwt.auth'], function () {
	Route::get('/', function() {
		return Categories::all();
	});
	Route::get('/{id}', 'CategoriesController@show')->name('categories.show');
	Route::put('/{id}', 'CategoriesController@update')->name('categories.update');
	Route::post('/', 'CategoriesController@store')->name('categories.store');
	Route::delete('/{id}', 'CategoriesController@destroy')->name('categories.delete');
});

Route::group(['prefix'=>'scorings', 'middleware'=>'jwt.auth'], function () {
	Route::get('/', function() {
		return Scorings::all();
	});
	Route::get('/{id}', 'ScoringsController@show');
	Route::put('/{id}', 'ScoringsController@update');
	Route::post('/', 'ScoringsController@store');
	Route::delete('/{id}', 'ScoringsController@destroy');
});





