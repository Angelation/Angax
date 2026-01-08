<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class Post extends Model
{
    use HasFactory;

    /**
     * La tabla utiliza 'postID' como clave primaria.
     * Mantenemos incrementing y tipo entero para compatibilidad con MySQL.
     */
    protected $primaryKey = 'postID';
    public $incrementing = true;
    protected $keyType = 'int';
    
    protected $fillable = [
        'userID',
        'user_name',
        'user_email',
        'content',
        'postDate',
        'image',
        'image_url',
        'isActive',
    ];
    
    protected function casts(): array
    {
        $casts = [];
        
        // Solo agregar casts si las columnas existen
        try {
            if (Schema::hasColumn('posts', 'postDate')) {
                $casts['postDate'] = 'datetime';
            }
            
            if (Schema::hasColumn('posts', 'isActive')) {
                $casts['isActive'] = 'boolean';
            }
        } catch (\Exception $e) {
            // Si hay error al verificar, usar estructura básica
        }
        
        return $casts;
    }
    
    // Relación: Un post pertenece a un usuario
    public function user()
    {
        if (Schema::hasColumn('posts', 'userID')) {
            return $this->belongsTo(User::class, 'userID', 'id');
        }

        return null;
    }
    
    // Relación: Un post puede tener muchos comentarios
    public function comments()
    {
        $postIDColumn = Schema::hasColumn('posts', 'postID') ? 'postID' : 'id';

        return $this->hasMany(Comment::class, 'postID', $postIDColumn);
    }
    
    // Relación: Un post puede recibir muchos likes
    public function likes()
    {
        $postIDColumn = Schema::hasColumn('posts', 'postID') ? 'postID' : 'id';

        return $this->hasMany(Like::class, 'postID', $postIDColumn);
    }
    
    // Accessor para obtener el ID correcto
    public function getPostIDAttribute()
    {
        return $this->attributes['postID'] ?? $this->attributes['id'] ?? null;
    }
}
