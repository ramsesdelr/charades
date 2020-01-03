<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UsersMatch extends Model
{
     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'users_id', 'matches_id', 'score',
    ];

    public function user()
    {
        // return $this->belongsToMany('App\Users');
        return $this->hasMany('App\Users', 'id', 'users_id');
    }

    protected $table = 'users_match';
}
