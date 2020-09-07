<?php

use Faker\Generator as Faker;
use App\Users;

$factory->define(App\Matches::class, function (Faker $faker) {
	$user = factory(Users::class)->create();
    return [
        'users_id' => $user->id,
        'name' => $faker->word(),
        'winner_id' => now(),
        'categories_id' => 1, // secret
    ];
});
