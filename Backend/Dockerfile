# Imagen base de Node.js
FROM node:16

# Directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Puerto que expone el contenedor
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]