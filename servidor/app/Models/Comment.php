<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $primaryKey = 'commentID';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'postID',
        'userID',
        'content',
        'commentDate',
        'isActive',
        'parent_comment_id',
    ];

    protected function casts(): array
    {
        return [
            'commentDate' => 'datetime',
            'isActive' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userID', 'userID');
    }

    public function post()
    {
        return $this->belongsTo(Post::class, 'postID', 'postID');
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_comment_id', 'commentID');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_comment_id', 'commentID')
            ->where('isActive', true)
            ->orderBy('commentDate', 'asc');
    }

    public function likes()
    {
        return $this->hasMany(CommentLike::class, 'commentID', 'commentID');
    }

    public function isLikedBy($userId)
    {
        return $this->likes()->where('userID', $userId)->exists();
    }
}
