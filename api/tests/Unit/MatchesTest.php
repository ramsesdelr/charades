<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Matches;
use App\Users;

class MatchesTest extends TestCase
{
    /**
     * Test if a match can be created
     *
     * @return void
     */
    public function test_can_create_match()
    {
        $data = [
        	'name' => $this->faker->sentence,
        	'password' => 1234,
        	'users_id' => Users::inRandomOrder()->first()->id
        ];

        $this->post(route('matches.store'), $data)
        	->assertStatus(201);
    }
}
