<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class Handler extends ExceptionHandler
{
    public function register(): void
    {
        $this->renderable(function (Throwable $exception, $request) {

            // Solo Inertia requests
            if (!$request->header('X-Inertia')) {
                return null;
            }

            // Detectar HTTP errors correctamente
            if ($exception instanceof HttpExceptionInterface) {

                $status = $exception->getStatusCode();

                if ($status === 404) {
                    return Inertia::render('Errors/NotFound')
                        ->toResponse($request)
                        ->setStatusCode(404);
                }

                if ($status === 500) {
                    return Inertia::render('Errors/ServerError')
                        ->toResponse($request)
                        ->setStatusCode(500);
                }
            }

            return null;
        });
    }
}