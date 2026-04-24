FROM node:20-alpine

WORKDIR /app

# Copier package.json et package-lock.json si présents
COPY package*.json ./

# Exposer le port 5173 (port par défaut de Vite)
EXPOSE 5173

# Commande de démarrage
CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0"]