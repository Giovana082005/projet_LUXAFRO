FROM php:8.4-fpm

# Arguments
ARG USER=www-data

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Installation des extensions PHP nécessaires pour Laravel
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Définir le répertoire de travail
WORKDIR /var/www/html

# Exposer le port 8000
EXPOSE 8000

# Commande de démarrage
CMD ["sh", "-c", "composer install --no-interaction --optimize-autoloader && php artisan serve --host=0.0.0.0 --port=8000"]