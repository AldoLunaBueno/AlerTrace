#!/bin/sh

echo "Iniciando simulación de emisión de datos desde el sensor..."

while true
do
  # valores aleatorios
  temperature=$(awk -v min=15 -v max=35 'BEGIN{srand(); print min+rand()*(max-min)}')
  humidity=$(awk -v min=40 -v max=80 'BEGIN{srand(); print int(min+rand()*(max-min))}')
  soilMoisture=$(awk -v min=20 -v max=60 'BEGIN{srand(); print int(min+rand()*(max-min))}')

  echo "Enviando datos: T=$temperature, H=$humidity, SM=$soilMoisture"

  curl -s -X POST 'http://api:8000/data' \
      -H 'Content-Type: application/json' \
      -d "{\"sensorId\": \"1\", \"temperature\": $temperature, \"humidity\": $humidity, \"soilMoisture\": $soilMoisture}"

  echo ""
  sleep 5  # espera 5 segundos antes de volver a enviar datos
done
