<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    protected $primaryKey = 'followID';
    
    protected $fillable = [
        'followerID',
        'followingID',
    ];
    
    public function follower()
    {
        return $this->belongsTo(User::class, 'followerID', 'id');
    }
    
    public function following()
    {
        return $this->belongsTo(User::class, 'followingID', 'id');
    }
}
