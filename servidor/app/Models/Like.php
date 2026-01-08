<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;

    protected $primaryKey = 'likeID';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'postID',
        'userID',
        'likeDate',
        'isActive',
    ];

    protected function casts(): array
    {
        return [
            'likeDate' => 'datetime',
            'isActive' => 'boolean',
        ];
    }
}
