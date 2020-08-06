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

Route::middleware('auth:api')->get('/user', function(Request $request) {
	return auth()->user();
});

Route::prefix('users')->group(function () { 
	
	Route::middleware('auth:api')->get('/', function() {
		return Users::select('id','name','email','phone')->get();
	});
	Route::middleware('auth:api')->put('/{id}', 'UsersController@update');
	Route::middleware('auth:api')->get('/{id}', 'UsersController@show');
	Route::post('/register', 'APIRegisterController@register');
	Route::post('/login', 'APILoginController@login');
	Route::post('/refresh_token', 'APILoginController@refreshToken');
	Route::post('/password_reset', 'UsersController@resetPassword');
});


Route::group(['prefix'=> 'matches', 'middleware'=>'auth:api'],function () {
	Route::get('/', function() {
		return Matches::all();
	})->name('matches.all');;
	Route::middleware('auth:api')->get('/{id}', 'MatchesController@show')->name('matches.show');
	Route::put('/{id}', 'MatchesController@update')->name('matches.update');
	Route::post('/', 'MatchesController@store')->name('matches.store');
	Route::delete('/{id}', 'MatchesController@destroy')->name('matches.delete');
	Route::post('/update_player_turn','MatchesController@updatePlayerTurn')->name('matches.update_player_turn');
	Route::post('/invite_user','UsersMatchController@inviteUser')->name('matches.invite');
	Route::post('/add_winner', 'MatchesController@addWinner')->name('matches.add_winner');
	Route::get('/notify_player_match_status/{player_id}/{match_status}', function ($player_id, $match_status) {

		$matchStatus = [
			'player_id' => $player_id,
			'status'=> $match_status
		];
		event(new NotifyPlayerMatchStarted($matchStatus));
	});
	Route::get('/recent/{user_id}', 'MatchesController@getRecentMatchesByuser')->name('matches.recent');

});

Route::post('word', 'WordsController@show'); 
Route::get('words', function() {
	return Words::all('title')->random(10);
});

Route::middleware('auth:api')->post('words/add', 'WordsController@store');



Route::group(['prefix'=> 'categories', 'middleware'=>'auth:api'], function () {
	Route::get('/', function() {
		return Categories::all();
	});
	Route::get('/{id}', 'CategoriesController@show')->name('categories.show');
	Route::put('/{id}', 'CategoriesController@update')->name('categories.update');
	Route::post('/', 'CategoriesController@store')->name('categories.store');
	Route::delete('/{id}', 'CategoriesController@destroy')->name('categories.delete');
});

Route::group(['prefix'=>'scorings', 
	//'middleware'=>'auth:api'
], function () {
	Route::get('/', function() {
		return Scorings::all();
	});
	Route::get('/{id}', 'ScoringsController@show');
	Route::put('/{id}', 'ScoringsController@update');
	Route::post('/add_point', 'UsersMatchController@addPointToScore');
	Route::delete('/{id}', 'ScoringsController@destroy');
});
