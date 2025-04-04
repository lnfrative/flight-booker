# Flight Booker

Ejemplo básico de aplicación para reserva y consulta de vuelos con integración de JWT para autenticación.

## Requisitos previos

- **Docker**: Versión 28.0.1
- **Docker Compose**: Versión v2.33.1

## Instrucciones

Importante, esta guía asegura el funcionamiento para un entorno de desarrollo. Para producción se deben hacer los cambios pertinentes en el [`docker-compose.yml`](./docker-compose.yml).

### 1. Clona el repositorio

Clona el repositorio en tu máquina local:

```bash
git clone https://github.com/lnfrative/flight-booker.git
cd flight-booker
```

Ejecuta el script de configuración inicial.

```bash
./generate_config.sh
```

El script genera las variables de entorno necesarias para la aplicación. Consultar [`.env.example`](./.env.example) para más detalles.


### 2. Docker compose

Si es la primera vez levantando los contenedores y se desea poblar la base de datos, ejecutar:

```bash
POPULATE_DB=YES docker-compose up
```

La salida mostará detalles con los datos de prueba.

Para posteriores ejecuciones es suficiente:

```bash
docker-compose up
```

O si se desea mantener los servicios en segundo plano:

```bash
docker-compose up -d
```

## Documentación del API

La documentación del API se especifica [`Flight_Booker.postman_collection.json`](./docs/Flight_Booker.postman_collection.json).

> Ningún valor de ejemplo debe usarse como valor de prueba a menos que se especifique lo contrario.

## Consideraciones

APP_PORT escucha por defecto el puerto 4010, para usar un puerto diferente se debe especificar la variable de entorno al momento de ejecutar [`generate_config.sh`](./generate_config.sh). Lo mismo aplica para las demás variables.

La variable de entorno BASE_URL en la documentación se debe actualizar si se modifica la variable APP_PORT.