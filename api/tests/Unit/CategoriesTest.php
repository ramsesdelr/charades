<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Categories;

class CategoriesTest extends TestCase
{
    /**
     * Test if a match can be created
     *
     * @return void
     */
    public function test_can_create_match()
    {
        $user = factory(Categories::class)->create();
        $data = [
        	'title' => $this->faker->word,
        ];

        $this->post(route('categories.store'), $data)
            ->assertJson($data)
        	->assertStatus(201);
    }
}
