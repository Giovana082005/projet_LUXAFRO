## Projet Luxafro 

Application web pour l'association Luxafro : plateforme dédiée à la promotion de la culture camerounaise à travers des événements culturels 

##  Stack technique

- **Backend** : Laravel 13 (PHP 8.4)
- **Frontend** : React 18 + Vite 
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


### 2. Lancer les services Docker

\`\`\`bash
docker compose up -d
\`\`\`

### 3. Accéder aux services

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