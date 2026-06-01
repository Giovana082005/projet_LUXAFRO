# Commandes utiles — Luxafro

Aide-mémoire des commandes courantes pour le développement.

>  Le nom du service Laravel dans Docker est `laravel`. Adapter les commandes si  `docker-compose.yml` utilise un autre nom.

---

## Docker

```bash
# Démarrer tous les conteneurs (en arrière-plan)
docker compose up -d

# Arrêter et supprimer les conteneurs
docker compose down

# Mettre en pause / reprendre sans supprimer
docker compose stop
docker compose start

# Voir les conteneurs en cours d'exécution
docker ps

# Entrer dans un conteneur (shell interactif)
docker exec -it NOM_DU_CONTENEUR sh
```

---

## Laravel (Artisan)

Toutes les commandes Artisan se lancent **dans le conteneur** via `docker compose exec laravel`.

### Application

```bash
# Générer la clé d'application
docker compose exec laravel php artisan key:generate

# Vider les caches de configuration (après modif du .env)
docker compose exec laravel php artisan config:clear
```

### Base de données

```bash
# Lancer les migrations
docker compose exec laravel php artisan migrate

# Réinitialiser complètement la BDD + migrations + données de test
docker compose exec laravel php artisan migrate:fresh --seed

# Lancer uniquement les seeders (données de test)
docker compose exec laravel php artisan db:seed

# Créer un nouveau fichier de migration
docker compose exec laravel php artisan make:migration NOM_DU_FICHIER
```

### Génération de code

```bash
# Créer un contrôleur
docker compose exec laravel php artisan make:controller NomController

# Créer un modèle
docker compose exec laravel php artisan make:model NomModele

# Lister toutes les routes
docker compose exec laravel php artisan route:list
```

---

## Frontend (npm)

Le frontend tourne dans le conteneur `react`. Les commandes npm se lancent donc via `docker compose exec react`.

```bash
# Installer les dépendances
docker compose exec react npm install

# Installer un package spécifique
docker compose exec react npm install NOM_DU_PACKAGE

# Lancer le serveur de développement (déjà lancé au démarrage du conteneur)
docker compose exec react npm run dev

# Build de production
docker compose exec react npm run build
```

---

## Reverb (WebSockets temps réel)


```bash
# Installer Reverb (une seule fois)
docker compose exec laravel composer require laravel/reverb
docker compose exec laravel php artisan reverb:install

# Démarrer le serveur Reverb dans le conteneur (port 8080)
docker compose exec laravel php artisan reverb:start --host=0.0.0.0 --port=8080
```

---

## Workflow type — Démarrer une journée de dev

```bash
# 1. Démarrer les conteneurs (backend, frontend, MySQL...)
docker compose up -d

# 2. Vérifier que tout tourne
docker ps
```

Le frontend (http://localhost:5173) et l'API (http://localhost:8000) sont alors accessibles directement.

## Workflow type — Repartir d'une base propre

```bash
# Réinitialise la BDD avec les données de test
docker compose exec laravel php artisan migrate:fresh --seed
```
