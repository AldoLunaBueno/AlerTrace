# Sumaq API

## Pasos para lograr la conexión SSH desde Windows con el servidor EC2

Aseguramos la privacidad de la llave privada:

```bash
icacls "key-pair-sumaq-server.pem" /inheritance:r
icacls "key-pair-sumaq-server.pem" /remove:g "BUILTIN\Administradores" "NT AUTHORITY\SYSTEM" "NT AUTHORITY\Usuarios autentificados" "BUILTIN\Usuarios"
icacls "key-pair-sumaq-server.pem" /grant:r "$($env:USERNAME):(R)"
icacls "key-pair-sumaq-server.pem"
```

Y establecemos la conexión usando OpenSSH:

```bash
ssh -i "key-pair-sumaq-server.pem" ec2-user@ec2-35-153-170-195.compute-1.amazonaws.com
```

## Aprovisionar EC2

En una consola SSH:

```bash
sudo yum install -y git docker python
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

## Pruebas locales

Para probar la API:

```bash
curl -v -X POST "http://localhost:8000/data" -H "Content-Type: application/json" \
    -d '{"temperature":1.0,"humidity":1,"soilMoisture":1}'
```
