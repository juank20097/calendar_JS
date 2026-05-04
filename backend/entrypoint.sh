#!/bin/sh

# Extraer host y puerto del DATABASE_URL
DB_HOST=$(echo $DATABASE_URL | sed 's/.*@\([^:/]*\).*/\1/')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_PORT=${DB_PORT:-5432}

echo "Esperando a PostgreSQL en $DB_HOST:$DB_PORT ..."
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done
echo "PostgreSQL listo."
exec "$@"
