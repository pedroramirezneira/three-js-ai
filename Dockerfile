FROM node:20-slim

WORKDIR /app

# Copiamos los archivos necesarios primero para aprovechar caché
COPY package*.json ./

# Instalamos dependencias en modo limpio
RUN npm ci

# Copiamos el resto del proyecto
COPY . .

# Construimos la app
RUN npm run build

# Definimos el puerto (cambiá si usás otro)
EXPOSE 4173

# Comando de arranque
CMD ["npm", "run", "start"]
