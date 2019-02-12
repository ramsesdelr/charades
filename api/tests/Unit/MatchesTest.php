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
        $user = factory(Users::class)->create();
        $data = [
        	'name' => $this->faker->sentence,
        	'password' => 1234,
        	'users_id' => $user->id
        ];

        $this->post(route('matches.store'), $data)
            ->assertJson($data)
        	->assertStatus(201);
    }

    /**
     * Test if a match can be updated
     * @return void
     */
    public function test_can_update_match(){
        $match = factory(Matches::class)->create();

        $data = [
            'name' => $this->faker->sentence,
            'password' => 'new pass',
        ];

        $this->put(route('matches.update', $match->id), $data)
            ->assertStatus(200);
    }

    /**
     * Test if a match can be shown
     * @return void
     */
    public function test_can_show_match(){
        $match = factory(Matches::class)->create();

        $this->get(route('matches.show', $match->id))
            ->assertStatus(200);
    }

    /**
     * Test if a match can be shown
     * @return void
     */
    public function test_can_delete_match(){
        $match = factory(Matches::class)->create();
        $this->delete(route('matches.delete', $match->id))
            ->assertStatus(204);
    }

}
