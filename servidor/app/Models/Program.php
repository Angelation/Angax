<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_name',
        'user_email',
        'title',
        'frequency',
        'goal',
        'notes',
    ];

    public function sessions(): HasMany
    {
        return $this->hasMany(WorkoutSession::class);
    }
}
