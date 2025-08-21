#!/bin/sh

echo "Inicializando DynamoDB localmente..."

# Esperar unos segundos para que DynamoDB Local arranque
sleep 5

# Crear tabla si no existe
aws dynamodb create-table \
    --table-name SensorData \
    --attribute-definitions \
        AttributeName=sensorId,AttributeType=S \
        AttributeName=timestamp,AttributeType=S \
    --key-schema \
        AttributeName=sensorId,KeyType=HASH \
        AttributeName=timestamp,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url http://db:8000 || echo "Tabla ya existe"

# Confirmar que existe
aws dynamodb list-tables --endpoint-url http://db:8000