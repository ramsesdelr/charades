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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('users')->group(function () {
	Route::get('/', function() {
		return Users::select('id','name','email','phone')->get();
	});
	Route::post('store', 'UsersController@store');
	Route::put('/{id}', 'UsersController@update');
	Route::get('/{id}', 'UsersController@show');
});


Route::prefix('matches')->group(function () {
	Route::get('/', function() {
		return Matches::all();
	})->name('matches.all');;
	Route::get('/{id}', 'MatchesController@show')->name('matches.show');;
	Route::put('/{id}', 'MatchesController@update')->name('matches.update');;
	Route::post('store', 'MatchesController@store')->name('matches.store');
	Route::delete('/{id}', 'MatchesController@destroy')->name('matches.delete');
});

Route::get('words', function() {
	return Words::all();
});

Route::prefix('categories')->group(function () {
	Route::get('/', function() {
		return Categories::all();
	});
	Route::get('/{id}', 'CategoriesController@show');
	Route::put('/{id}', 'CategoriesController@update');
	Route::post('store', 'CategoriesController@store');
	Route::delete('/{id}', 'CategoriesController@destroy');
});

Route::prefix('scorings')->group(function () {
	Route::get('/', function() {
		return Scorings::all();
	});
	Route::get('/{id}', 'ScoringsController@show');
	Route::put('/{id}', 'ScoringsController@update');
	Route::post('store', 'ScoringsController@store');
	Route::delete('/{id}', 'ScoringsController@destroy');
});





