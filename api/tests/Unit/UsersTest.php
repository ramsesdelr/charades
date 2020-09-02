<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Users;

class UsersTest extends TestCase
{
    /**
     * Test if a user can be registered
     *
     * @return void
     */
    public function test_can_user_registrate()
    {
        $data = [
        	'email' => $this->faker->email,
        	'name' => $this->faker->name,
        	'password' => $this->faker->password,
        	'phone' => $this->faker->phoneNumber,
        ];

        $this->post(route('users.registration'), $data)
            ->assertJsonStructure(['token', 'user_data']);
    }
}
