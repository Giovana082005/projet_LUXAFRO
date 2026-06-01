# Projet Luxafro

Application web pour l'association **Luxafro** : une plateforme dédiée à la promotion de la culture camerounaise à travers des événements culturels.

Les visiteurs peuvent découvrir les événements à venir, s'inscrire après création d'un compte, et contacter l'association. Un espace d'administration permet de gérer les utilisateurs, les événements et les messages reçus.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | Laravel 13 (PHP 8.4) |
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS |
| Base de données | MySQL 8 |
| Authentification | Laravel Sanctum (sessions) |
| Protection anti-bots | Google reCAPTCHA v3 |
| Conteneurisation | Docker + Docker Compose |

---

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré
- [Git](https://git-scm.com/)

Aucune installation locale de PHP, Node ou MySQL n'est nécessaire : tout tourne dans des conteneurs Docker.

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Giovana082005/projet_LUXAFRO.git
cd projet_LUXAFRO
```

### 2. Configurer les variables d'environnement

**Backend :**

```bash
cd backend
cp .env.example .env
cd ..
```

Voir la section [Variables d'environnement](#variables-denvironnement) pour les valeurs à renseigner.

**Frontend :**

```bash
cd frontend
cp .env.example .env
cd ..
```

> Les fichiers `.env` sont lus au démarrage des conteneurs, donc copie-les **avant** l'étape 3.

### 3. Lancer les services Docker

```bash
docker compose up -d
```

### 4. Générer la clé d'application Laravel

```bash
docker compose exec laravel php artisan key:generate
```

### 5. Lancer les migrations (et les données de test)

```bash
docker compose exec laravel php artisan migrate --seed
```

> Le flag `--seed` est optionnel : il remplit la base avec des données de démonstration (utilisateurs, événements, catégories).

### 6. Installer les dépendances frontend

Le frontend tourne dans le conteneur `react` (démarré à l'étape 3). Installe ses dépendances :

```bash
docker compose exec react npm install
```

Le serveur de développement Vite démarre automatiquement avec le conteneur. Si besoin de le relancer manuellement :

```bash
docker compose exec react npm run dev
```

---

## Accéder aux services

| Service | URL |
|---|---|
| Frontend React | http://localhost:5173 |
| Backend Laravel (API) | http://localhost:8000 |
| phpMyAdmin | http://localhost:8081 |
| Reverb (WebSockets) | ws://localhost:8080 |

> Identifiants phpMyAdmin : serveur `mysql`, utilisateur `luxafro_user` / `luxafro_password` (ou `root` / `rootpassword`).

---

## Variables d'environnement

### Backend (`backend/.env`)

```env
APP_NAME=
APP_ENV=
APP_KEY=
APP_DEBUG=
APP_URL=

APP_LOCALE=
APP_FALLBACK_LOCALE=
APP_FAKER_LOCALE=

APP_MAINTENANCE_DRIVER=
# APP_MAINTENANCE_STORE=database

# PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=

LOG_CHANNEL=
LOG_STACK=
LOG_DEPRECATIONS_CHANNEL=
LOG_LEVEL=

DB_CONNECTION=
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

# Session settings
SESSION_DRIVER=
SESSION_LIFETIME=
SESSION_DOMAIN=
SESSION_SAME_SITE=
SESSION_ENCRYPT=
SESSION_PATH=

# Sanctum SPA configuration
ANCTUM_STATEFUL_DOMAINS=

BROADCAST_CONNECTION=
FILESYSTEM_DISK=
QUEUE_CONNECTION=

CACHE_STORE=
# CACHE_PREFIX=

MEMCACHED_HOST=

REDIS_CLIENT=
REDIS_HOST=
REDIS_PASSWORD=
REDIS_PORT=

MAIL_MAILER=
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=

VITE_APP_NAME=
FRONTEND_URL=


#API base URL
API_BASE_URL =

REVERB_APP_ID=
REVERB_APP_KEY=
REVERB_APP_SECRET=
REVERB_HOST=
REVERB_PORT=
REVERB_SCHEME=

VITE_REVERB_APP_KEY=
VITE_REVERB_HOST=
VITE_REVERB_PORT=
VITE_REVERB_SCHEME=


RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

> Le mot de passe root MySQL est `rootpassword` (utile pour phpMyAdmin ou un accès admin direct).

### Frontend (`frontend/.env`)

```env
FRONTEND_URL=
#API base URL
VITE_API_URL=

VITE_REVERB_APP_KEY=

VITE_REVERB_HOST=

VITE_REVERB_PORT=

VITE_REVERB_SCHEME=

# reCAPTCHA v3 (clé publique uniquement)
VITE_RECAPTCHA_SITE_KEY=ta_site_key
VITE_FALLBACK_IMAGE_URL=
```

>  Les clés reCAPTCHA se créent sur https://www.google.com/recaptcha/admin/create
> (type **v3**, domaines : `localhost`, `127.0.0.1`, + domaine de production).
> La **secret key** reste uniquement côté backend, jamais dans le frontend.

---

## Structure du projet

```
projet_LUXAFRO/
├── backend/              # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/      # RecaptchaService, etc.
│   ├── routes/api.php
│   ├── database/migrations/
│   └── Dockerfile
├── frontend/             # Interface React
│   ├── src/
│   │   ├── pages/        # Pages (Home, Contact, EventDetail, admin/...)
│   │   ├── components/   # Composants réutilisables
│   │   ├── hooks/        # Hooks personnalisés (useAuth, useEvents...)
│   │   ├── types/        # Types TypeScript
│   │   └── config/       # Configuration API
│   └── Dockerfile
├── docker-compose.yml
├── README.md
├── COMMANDS.md           # Aide-mémoire des commandes courantes
└── docs/
    └── DOCUMENTATION.md  # Documentation technique complète
```

---

## Documentation

- **[COMMANDS.md](./COMMANDS.md)** — Aide-mémoire des commandes Docker, Artisan et npm
- **[docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)** — Documentation technique complète (architecture, sécurité, flux de données)

---

## Dépannage rapide

| Problème | Piste |
|---|---|
| `419 Page Expired` sur les requêtes | Vérifier `SANCTUM_STATEFUL_DOMAINS` et `SESSION_DOMAIN` |
| Frontend ne joint pas l'API | Vérifier `VITE_API_URL` et que le conteneur Laravel tourne |
| Erreur de connexion BDD | Vérifier que `DB_HOST` = nom du service MySQL Docker |
| Migrations échouent | Attendre que MySQL soit prêt, puis relancer la commande |
| reCAPTCHA bloque tout | Vérifier que les clés `.env` correspondent au bon domaine |
```
