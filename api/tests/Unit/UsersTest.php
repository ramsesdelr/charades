<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Users;

class UsersTest extends TestCase
{
    public function setUp() :void {
        parent::setUp();

        Users::insert([
            'email'=> env('API_TEST_EMAIL'),
            'name' => 'Test User',
            'password' =>  bcrypt(env('API_TEST_PASSWORD')),
            'phone'=>'000000000',
        ]);
    }

    /**
     * Test if a user can be registered
     *
     * @return void
     */
    public function test_can_user_registrate() {
        $data = [
        	'email' => $this->faker->email,
        	'name' => $this->faker->name,
        	'password' => $this->faker->password,
        	'phone' => $this->faker->phoneNumber,
        ];

        $this->post(route('users.registration'), $data)
            ->assertJsonStructure(['token', 'user_data']);
    }

    /**
     * Test if the user has the ability to log in
     * @return void
     */
    public function test_can_user_login() {
        
        $this->post(route('users.login'),[
            'email' => env('API_TEST_EMAIL'),
            'password' =>  env('API_TEST_PASSWORD'),
        ])->assertJsonStructure(['token', 'user_data'])
        ->assertStatus(200);

    }
}
