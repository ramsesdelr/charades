<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Matches;
use App\Users;
use JWTAuth;


class MatchesTest extends TestCase
{
    protected $token;
    public function setUp() :void {
        parent::setUp();
        Users::insert([
            'email'=> 'test@email.com',
            'name' => 'Test User',
            'password' =>  bcrypt('testing123'),
            'phone'=>'000000000',
        ]);

        $user = Users::where('email', 'test@email.com')->first();
        
        $this->token = JWTAuth::fromUser($user);
    }
    
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
        	'categories_id' => 1,
        	'users_id' => $user->id
        ];

        $this->post(route('matches.store'), $data, [
            'Authorization' => 'Bearer '. $this->token
        ])->assertJson($data)->assertStatus(201);
    }

    /**
     * Test if a match can be updated
     * @return void
     */
    public function test_can_update_match(){
        $match = factory(Matches::class)->create();

        $data = [
            'name' => $this->faker->sentence,
            'categories_id' => 2,
        ];

        $this->put(route('matches.update', $match->id), $data, [
            'Authorization' => 'Bearer '. $this->token
        ])->assertStatus(200);
    }

    /**
     * Test if a match can be shown
     * @return void
     */
    public function test_can_show_match(){
        $match = factory(Matches::class)->create();

        $this->get(route('matches.show', $match->id), [
             'Authorization' => 'Bearer '. $this->token
        ])->assertStatus(200);
    }

    /**
     * Test if a match can be deleted
     * @return void
     */
    public function test_can_delete_match(){
        $match = factory(Matches::class)->create();

        $this->deleteJson(route('matches.delete', $match->id), [], [
            'Authorization' => 'Bearer '. $this->token
       ])->assertStatus(200);
    }

}
