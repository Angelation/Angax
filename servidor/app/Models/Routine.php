<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Routine extends Model
{
    protected $primaryKey = 'routineID';
    public $incrementing = true;

    protected $fillable = [
        'userID',
        'routineName',
        'goal',
        'creationDate',
        'isActive',
    ];

    protected $casts = [
        'creationDate' => 'date',
        'isActive' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userID', 'id');
    }

    public function exercises(): BelongsToMany
    {
        return $this->belongsToMany(Exercise::class, 'routine_exercises', 'routineID', 'exerciseID', 'routineID', 'exerciseID')
            ->withPivot('sets', 'reps', 'weight', 'isActive')
            ->wherePivot('isActive', true)
            ->withTimestamps();
    }
}
