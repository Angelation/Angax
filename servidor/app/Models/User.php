<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'userID';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'registerDate',
        'height',
        'weight',
        'profilePhoto',
        'bio',
        'isActive',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            // No usar 'hashed' cast aquí, ya que usamos Hash::make() manualmente en el controlador
            // registerDate se guarda como string YYYY-MM-DD para compatibilidad con SQLite
            'height' => 'float',
            'weight' => 'float',
            'isActive' => 'boolean',
        ];
    }
    
    /**
     * Get registerDate as a date attribute
     */
    public function getRegisterDateAttribute($value)
    {
        if (empty($value)) {
            return null;
        }
        try {
            return \Carbon\Carbon::parse($value);
        } catch (\Exception $e) {
            return $value; // Retornar el valor original si no se puede parsear
        }
    }
    
    /**
     * Set registerDate from various formats
     */
    public function setRegisterDateAttribute($value)
    {
        if ($value instanceof \Carbon\Carbon || $value instanceof \DateTime) {
            $this->attributes['registerDate'] = $value->format('Y-m-d');
        } elseif (is_string($value) && !empty($value)) {
            // Si ya está en formato YYYY-MM-DD, usarlo directamente
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
                $this->attributes['registerDate'] = $value;
            } else {
                // Intentar parsear y formatear
                try {
                    $this->attributes['registerDate'] = \Carbon\Carbon::parse($value)->format('Y-m-d');
                } catch (\Exception $e) {
                    $this->attributes['registerDate'] = null;
                }
            }
        } else {
            $this->attributes['registerDate'] = null;
        }
    }
    
    public function routines()
    {
        return $this->hasMany(Routine::class, 'userID', 'userID');
    }
    
    public function progress()
    {
        return $this->hasMany(Progress::class, 'userID', 'userID');
    }
    
    public function posts()
    {
        return $this->hasMany(Post::class, 'userID', 'userID');
    }
    
    public function comments()
    {
        return $this->hasMany(Comment::class, 'userID', 'userID');
    }
    
    public function likes()
    {
        return $this->hasMany(Like::class, 'userID', 'userID');
    }
    
    public function trainers()
    {
        return $this->belongsToMany(User::class, 'trainers_clients', 'clientID', 'trainerID', 'userID', 'userID')
                    ->withPivot('isActive')
                    ->withTimestamps();
    }
    
    public function clients()
    {
        return $this->belongsToMany(User::class, 'trainers_clients', 'trainerID', 'clientID', 'userID', 'userID')
                    ->withPivot('isActive')
                    ->withTimestamps();
    }
    
    public function following()
    {
        return $this->belongsToMany(User::class, 'follows', 'followerID', 'followingID', 'userID', 'userID')
                    ->withTimestamps();
    }
    
    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'followingID', 'followerID', 'userID', 'userID')
                    ->withTimestamps();
    }
}
