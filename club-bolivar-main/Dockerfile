FROM php:8.4-fpm-alpine

# Instalar dependencias del sistema y Node.js con npm
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    postgresql-dev

# Instalar extensiones de PHP necesarias para PostgreSQL
RUN docker-php-ext-install pdo pdo_pgsql bcmath gd

# Obtener Composer oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copiar archivos de dependencias primero para aprovechar la caché de Docker
COPY composer.json composer.lock package.json package-lock.json ./

# Instalar dependencias
RUN composer install --no-interaction --no-plugins --no-scripts --prefer-dist
RUN npm install

# Copiar el resto del código del proyecto
COPY . .

# Compilar los assets de React/Vite para producción
RUN npm run build

EXPOSE 8000

# Script de arranque: limpia caché y levanta el servidor integrado de Laravel
CMD sh -c "php artisan optimize:clear && php artisan config:clear && php artisan serve --host=0.0.0.0 --port=8000"