## Projet Luxafro 

Application web pour l'association Luxafro : plateforme dédiée à la promotion de la culture camerounaise à travers des événements culturels 

##  Stack technique

- **Backend** : Laravel 13 (PHP 8.4)
- **Frontend** : React 19 + Vite + TypeScript + Tailwind CSS
- **Base de données** : MySQL 8
- **Conteneurisation** : Docker + Docker Compose


## Prérequis

- Docker Desktop installé
- Git

## Installation

### 1. Cloner le dépôt

\`\`\`bash
git clone https://github.com/Giovana082005/projet_LUXAFRO.git
cd luxafro
\`\`\`


### 2. Copier le fichier .env d'exemple
cd backend
cp .env.example .env
cd ..

### 3. Lancer les services Docker
\`\`\`bash
docker compose up -d
\`\`\`
### 4. GÉNÉRER SA PROPRE CLÉ LARAVEL
docker compose exec laravel php artisan key:generate

### 5. Lancer les migrations
docker compose exec laravel php artisan migrate

### 6. Accéder aux services

- **phpMyAdmin** : http://localhost:8080
- **Backend Laravel** : http://localhost:8000 
- **Frontend React** : http://localhost:5173 


## Structure du projet

\`\`\`
luxafro/
├── backend/              # API Laravel
├── frontend/             # Interface React
├── docker-compose.yml    # Configuration Docker
├── .gitignore
└── README.md
\`\`\`

### créer un controller
docker compose exec laravel php artisan make:controller nom_du_controller

###  démarrer le docker
docker-compose up -d

###  Voir les conténeurs en cours 
docker ps

###  entrer dans un conteneur
docker exec -it NOM_DU_CONTENEUR sh

### installer des packages
npm install NOM_DU_PACKAGE

### LANCER L'app
npm run dev

### démarrer les conteneurs
docker-compose up -d

### arreter les conteneurs 
docker-compose down

### mettre  les conteneurs en pause
docker-compose stop
docker-compose start