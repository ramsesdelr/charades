<?php

use Faker\Generator as Faker;

$factory->define(App\Users::class, function (Faker $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'password' => $password ?: $password = bcrypt('secret'),
        'phone' => $faker->phoneNumber,
        'is_deleted' => 0,
    ];
});