<?php

namespace App\Services;

use App\Models\MembershipCounter;

class MembershipNumberService
{
    public function nextSocioNumber(): string
    {
        $counter = MembershipCounter::where('key', 'socios')->lockForUpdate()->first();

        if (!$counter) {
            MembershipCounter::create([
                'key' => 'socios',
                'last_value' => 0,
            ]);

            $counter = MembershipCounter::where('key', 'socios')->lockForUpdate()->first();
        }

        $counter->last_value = $counter->last_value + 1;
        $counter->save();

        return 'SOC-' . str_pad((string) $counter->last_value, 8, '0', STR_PAD_LEFT);
    }
}