<?php

use Illuminate\Http\Request;
use App\Users;
use App\Categories;
use App\Words;
use App\Matches;
use App\Scorings;
use App\Events\NotifyPlayerMatchStarted;
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
	Route::middleware('jwt.auth')->get('/{id}', 'MatchesController@show')->name('matches.show');
	Route::put('/{id}', 'MatchesController@update')->name('matches.update');;
	Route::post('/', 'MatchesController@store')->name('matches.store');
	Route::delete('/{id}', 'MatchesController@destroy')->name('matches.delete');
	Route::post('/update_player_turn','MatchesController@updatePlayerTurn')->name('matches.update_player_turn');
	Route::post('/invite_user','UsersMatchController@inviteUser')->name('matches.invite');
	Route::get('/notify_player_match_started/{player_id}', function ($player_id) {
		event(new NotifyPlayerMatchStarted($player_id));
	});

});

Route::get('word', function() {
	return Words::all('title')->random(1)->first();
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

Route::group(['prefix'=>'scorings', 
	//'middleware'=>'jwt.auth'
], function () {
	Route::get('/', function() {
		return Scorings::all();
	});
	Route::get('/{id}', 'ScoringsController@show');
	Route::put('/{id}', 'ScoringsController@update');
	Route::post('/add_point', 'UsersMatchController@addPointToScore');
	Route::delete('/{id}', 'ScoringsController@destroy');
});
