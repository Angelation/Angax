<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Exercise extends Model
{
    protected $primaryKey = 'exerciseID';
    public $incrementing = true;

    protected $fillable = [
        'exerciseName',
        'muscleGroup',
        'description',
        'isActive',
    ];

    protected $casts = [
        'isActive' => 'boolean',
    ];

    public function routines(): BelongsToMany
    {
        return $this->belongsToMany(Routine::class, 'routine_exercises', 'exerciseID', 'routineID', 'exerciseID', 'routineID')
            ->withPivot('sets', 'reps', 'weight', 'isActive')
            ->withTimestamps();
    }
}
