<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Matches extends Model
{
    use SoftDeletes; 
     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'users_id', 'name', 'current_player','categories_id',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * Get the Users from the match.
     */
    public function users()
    {
        return $this->hasMany('App\UsersMatch');
    }

    /**
     * Get Match woner
     */
    public function user() {
        return $this->belongsTo('App\Users','users_id','id');
    }
}
