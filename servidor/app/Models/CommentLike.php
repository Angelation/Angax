<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentLike extends Model
{
    use HasFactory;

    protected $primaryKey = 'likeID';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'commentID',
        'userID',
    ];

    public function comment()
    {
        return $this->belongsTo(Comment::class, 'commentID', 'commentID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userID', 'id');
    }
}

