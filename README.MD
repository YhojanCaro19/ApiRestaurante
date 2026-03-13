# Proyecto ApiRestaurante

API REST para un restaurante desarrollada con **Node.js** y **Express**, que gestiona **ingredientes, platos, mesas y órdenes**.

La API está protegida por **API Key**

-------------------------------------------------------------------------------------------------------------------------------------

# Tecnologías usadas

- Node.js
- Express.js
- SQLite3

-------------------------------------------------------------------------------------------------------------------------------------

# Autenticación

Todos los endpoints requieren el siguiente header:

api: ARROZCONPOLLO

-------------------------------------------------------------------------------------------------------------------------------------

# URL de producción

https://apirestaurante-2pxq.onrender.com

-------------------------------------------------------------------------------------------------------------------------------------

# Estructura

ApiRestaurante/
├── .gitignore
├── .env
├── db.js
├── index.js
├── database.db
├── package-lock.json
├── package.json
├── README.md
└── routes/
    ├── ingredientes.js
    ├── mesas.js
    ├── ordenes.js
    └── platos.js

-------------------------------------------------------------------------------------------------------------------------------------

# ENDPOINTS

## 1. Ingredientes

Método  | Ruta                  | Descripción
--------|-----------------------|--------------------------------------------
GET     | /ingredientes         | Lista todos los ingredientes
GET     | /ingredientes/:id     | Obtiene un ingrediente por ID
POST    | /ingredientes         | Crea un ingrediente
PUT     | /ingredientes/:id     | Actualiza un ingrediente existente
DELETE  | /ingredientes/:id     | Elimina un ingrediente


-------------------------------------------------------------------------------------------------------------------------------------

## 2. Platos

Método  | Ruta              | Descripción
--------|-------------------|--------------------------------------------
GET     | /platos           | Lista todos los platos
GET     | /platos/:id       | Obtiene un plato por ID
POST    | /platos           | Crea un plato
PUT     | /platos/:id       | Actualiza un plato existente
DELETE  | /platos/:id       | Elimina un plato



-------------------------------------------------------------------------------------------------------------------------------------

## 3. Mesas

Método  | Ruta              | Descripción
--------|-------------------|--------------------------------------------
GET     | /mesas            | Lista todas las mesas
GET     | /mesas/:id        | Obtiene una mesa por ID
POST    | /mesas            | Crea una mesa
PUT     | /mesas/:id        | Actualiza una mesa existente
DELETE  | /mesas/:id        | Elimina una mesa



-------------------------------------------------------------------------------------------------------------------------------------

## 4. Órdenes

Método  | Ruta              | Descripción
--------|-------------------|--------------------------------------------
GET     | /ordenes          | Lista todas las órdenes
GET     | /ordenes/:id      | Obtiene una orden por ID (incluye platos)
POST    | /ordenes          | Crea una orden
PUT     | /ordenes/:id      | Actualiza una orden existente
DELETE  | /ordenes/:id      | Elimina una orden



-------------------------------------------------------------------------------------------------------------------------------------

# Ejemplos de uso

# Listar todos los platos
curl https://apirestaurante-2pxq.onrender.com/platos \
     -H "api: ARROZCONPOLLO"

-------------------------------------------------------------------------------------------------------------------------------------

# Crear un plato
curl -X POST https://apirestaurante-2pxq.onrender.com/platos \
     -H "api: ARROZCONPOLLO" \
     -H "Content-Type: application/json" \
     -d '{"nombre":"Pizza","precio":25000,"categoria":"Italiana"}'

-------------------------------------------------------------------------------------------------------------------------------------

# Buscar plato por ID
curl https://apirestaurante-2pxq.onrender.com/platos/1 \
     -H "api: ARROZCONPOLLO"

-------------------------------------------------------------------------------------------------------------------------------------

# Actualizar un plato
curl -X PUT https://apirestaurante-2pxq.onrender.com/platos/1 \
     -H "api: ARROZCONPOLLO" \
     -H "Content-Type: application/json" \
     -d '{"nombre":"Pizza Especial","precio":30000,"categoria":"Italiana"}'

-------------------------------------------------------------------------------------------------------------------------------------

# Eliminar un plato
curl -X DELETE https://apirestaurante-2pxq.onrender.com/platos/1 \
     -H "api: ARROZCONPOLLO"

-------------------------------------------------------------------------------------------------------------------------------------

# Crear una mesa
curl -X POST https://apirestaurante-2pxq.onrender.com/mesas \
     -H "api: ARROZCONPOLLO" \
     -H "Content-Type: application/json" \
     -d '{"numero":5,"capacidad":4,"estado":"disponible"}'

-------------------------------------------------------------------------------------------------------------------------------------

# Crear una orden
curl -X POST https://apirestaurante-2pxq.onrender.com/ordenes \
     -H "api: ARROZCONPOLLO" \
     -H "Content-Type: application/json" \
     -d '{"mesaId":1,"platos":[{"plato_id":1,"cantidad":2}],"total":50000,"estado":"En preparacion"}'

-------------------------------------------------------------------------------------------------------------------------------------

# Sin header (debe retornar 401)
curl https://apirestaurante-2pxq.onrender.com/platos


-------------------------------------------------------------------------------------------------------------------------------------

# Integrantes

- Yhojan Andrés Caro González
- Jhoan Sebastián González Cartagena