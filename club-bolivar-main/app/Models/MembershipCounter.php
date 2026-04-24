<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembershipCounter extends Model
{
    protected $table = 'membership_counters';

    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'key',
        'last_value',
    ];
}