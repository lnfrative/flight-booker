# Flight Booker

Ejemplo básico de aplicación para reserva y consulta de vuelos con integración de JWT para autenticación.

## Requisitos previos

- **Docker**: Versión 28.0.1
- **Docker Compose**: Versión v2.33.1

## Instrucciones

### 1. Clona el repositorio

Clona el repositorio en tu máquina local:

```bash
git clone hhttps://github.com/lnfrative/flight-booker.git
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

Para posteriores ejecuciones, es suficiente ejecutar:

```bash
docker-compose up
```

O si se desea mantener los servicios en segundo plano:

```bash
docker-compose up -d
```

## Documentación

La documentación del API se especifica [`Flight_Booker.postman_collection.json`](./docs/Flight_Booker.postman_collection.json).

Consideraciones: La variable de entorno BASE_URL en la documentación se debe actualizar si se modifica la variable APP_PORT al levantar los contenedores.