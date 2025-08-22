# Imagen base ligera de Node
FROM node:20-alpine

WORKDIR /app

# Copiar paquetes de json y locks para aprovechar la caché de dependencias
COPY package*.json ./

RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto
EXPOSE 8080

# Iniciamos en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
