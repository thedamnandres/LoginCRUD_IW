FROM node:20-alpine

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache git

# Copiar archivos de configuración de dependencias
COPY package.json package-lock.json* ./

# Limpiar caché y instalar dependencias
RUN npm cache clean --force
RUN npm ci --only=production=false

# Verificar que vite está instalado 
RUN npx vite --version

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 5173

# Comando para desarrollo
CMD ["npm", "run", "dev"]