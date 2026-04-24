<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSocioRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'ci' => strtoupper(trim((string) $this->ci)),
            'email' => strtolower(trim((string) $this->email)),
            'telefono' => preg_replace('/\s+/', '', (string) $this->telefono),
        ]);
    }

    public function rules(): array
    {
        return [
            'nombres' => ['required', 'string', 'max:150'],
            'apellidos' => ['required', 'string', 'max:150'],
            'ci' => [
                'required',
                'string',
                'max:30',
                Rule::unique('socios', 'ci')->where(function ($query) {
                    return $query->where('deleted', false)
                        ->where('activo', true);
                }),
            ],
            'fecha_nacimiento' => ['required', 'date', 'before:today'],
            'email' => [
                'required',
                'string',
                'max:150',
                'email:rfc',
                Rule::unique('socios', 'email')->where(function ($query) {
                    return $query->where('deleted', false)
                        ->where('activo', true);
                }),
            ],
            'telefono' => ['required', 'regex:/^[0-9]{7,15}$/'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'tipo_membresia' => ['nullable', Rule::in(['regular', 'vip', 'familiar'])],
            'observaciones' => ['nullable', 'string', 'max:1000'],
            'fotografia' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png',
                'max:5120',
                'dimensions:min_width=400,min_height=400',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nombres.required' => 'Los nombres son obligatorios.',
            'apellidos.required' => 'Los apellidos son obligatorios.',
            'ci.required' => 'El CI es obligatorio.',
            'ci.unique' => 'Ya existe un socio activo con ese CI.',
            'fecha_nacimiento.required' => 'La fecha de nacimiento es obligatoria.',
            'fecha_nacimiento.before' => 'La fecha de nacimiento debe ser anterior a hoy.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico no tiene un formato válido.',
            'email.unique' => 'Ya existe un socio activo con ese correo.',
            'telefono.required' => 'El teléfono es obligatorio.',
            'telefono.regex' => 'El teléfono debe tener entre 7 y 15 dígitos.',
            'fotografia.required' => 'La fotografía es obligatoria.',
            'fotografia.mimes' => 'La fotografía debe estar en formato JPG o PNG.',
            'fotografia.max' => 'La fotografía no debe superar los 5 MB.',
            'fotografia.dimensions' => 'La fotografía debe tener mínimo 400x400 píxeles.',
        ];
    }
}