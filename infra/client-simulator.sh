#!/bin/sh

echo "Iniciando simulación del front..."

sleep 3

while true
do
  echo "Consultando último dato..."
  response=$(curl -s -X GET 'http://api:8000/latest')

  # Mostrar el JSON crudo
  echo "Respuesta de la API: $response"

  sleep 5
done
