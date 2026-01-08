<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoutineExercise extends Model
{
    protected $primaryKey = 'routineExerciseID';
    public $incrementing = true;

    protected $fillable = [
        'routineID',
        'exerciseID',
        'sets',
        'reps',
        'weight',
        'isActive',
    ];

    protected $casts = [
        'sets' => 'integer',
        'reps' => 'integer',
        'weight' => 'float',
        'isActive' => 'boolean',
    ];

    public function routine(): BelongsTo
    {
        return $this->belongsTo(Routine::class, 'routineID', 'routineID');
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class, 'exerciseID', 'exerciseID');
    }
}
