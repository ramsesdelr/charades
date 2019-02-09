<?php

use Faker\Generator as Faker;

$factory->define(App\Words::class, function (Faker $faker) {
    return [
        'title' => $faker->word,
        'users_id' => App\Users::inRandomOrder()->first()->id,
    ];
});
