#!/bin/bash

# Función para generar strings aleatorios
generate_random_string() {
    local length=$1
    openssl rand -hex "$((length / 2))" | head -c "$length"
}

# Variables de entorno fijas y generadas
NODE_ENV=${NODE_ENV:-"development"}
POSTGRES_USER="flight_booker"
POSTGRES_PASSWORD=$(generate_random_string 32)
POSTGRES_DB="$POSTGRES_USER"
POSTGRES_HOST="db"
POSTGRES_PORT="5432"
JWT_SECRET_KEY=$(generate_random_string 32)
JWT_EXPIRATION_TIME="3600"
APP_PORT=${APP_PORT:-"4010"}

# Construir DATABASE_URL dinámicamente
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

# Crear el archivo .env
cat <<EOF > .env
NODE_ENV="$NODE_ENV"
APP_PORT="$APP_PORT"
POSTGRES_USER="$POSTGRES_USER"
POSTGRES_PASSWORD="$POSTGRES_PASSWORD"
POSTGRES_DB="$POSTGRES_DB"
POSTGRES_HOST="$POSTGRES_HOST"
POSTGRES_PORT="$POSTGRES_PORT"
JWT_SECRET_KEY="$JWT_SECRET_KEY"
JWT_EXPIRATION_TIME="$JWT_EXPIRATION_TIME"
DATABASE_URL="$DATABASE_URL"
EOF

echo "Configuración generada correctamente!"