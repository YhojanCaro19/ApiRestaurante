# Proyecto Restaurante API

API REST para un restaurante desarrollada con **Node.js** y **Express**, que gestiona **ingredientes, platos, mesas y órdenes**.  

La API está protegida por **API Key** 

-------------------------------------------------------------------------------------------------------------------------------------
# Tecnologías usadas

- Node.js
- Express.js
- SQLite3

-------------------------------------------------------------------------------------------------------------------------------------

# Autenticación

Todos los endpoints requieren el siguiente header
api: 123

-------------------------------------------------------------------------------------------------------------------------------------

# Estructura
mi-api/
├── .gitignore
├── db.js
├── index.js
├── database.db
├── package-lock.json
├── package.json
├── README.md
├── CollectionsPostman/
├── db/
├── node_modules/
└── routes/
    ├── ingredientes.js
    ├── mesas.js
    ├── ordenes.js
    └── platos.js
    
-------------------------------------------------------------------------------------------------------------------------------------

# END POINTS
# 1. Ingredientes
Método	      Ruta	                                Descripción
GET	    /ingredientes	             Lista todos los ingredientes 
GET	    /ingredientes/:id	         Obtiene un ingrediente por ID
POST	/ingredientes	             Crea un ingrediente
PUT	    /ingredientes/:id	         Actualiza un ingrediente existente
DELETE	/ingredientes/:id	         Elimina un ingrediente

-------------------------------------------------------------------------------------------------------------------------------------


# 2. Platos
Método	      Ruta	                                Descripción
GET	     /platos	                 Lista todos los platos
GET	     /platos/:id	             Obtiene un plato por ID
POST	 /platos                     Crea un plato
PUT	     /platos/:id	             Actualiza un plato existente
DELETE	 /platos/:id	             Elimina un plato

-------------------------------------------------------------------------------------------------------------------------------------


# 3. Mesas
Método	      Ruta	                                Descripción
GET	      /mesas	                  Lista todas las mesas
GET	      /mesas/:id	              Obtiene una mesa por ID
POST	  /mesas	                  Crea una mesa 
PUT	      /mesas/:id	              Actualiza una mesa existente
DELETE	  /mesas/:id	              Elimina una mesa

-------------------------------------------------------------------------------------------------------------------------------------


# 4. Ordenes
Método	      Ruta	                                Descripción
GET	      /ordenes	                  Lista todas las órdenes
GET	      /ordenes/:id	              Obtiene una orden por ID
POST	  /ordenes	                  Crea una orden
PUT	      /ordenes/:id	              Actualiza una orden existente
DELETE	  /ordenes/:id	              Elimina una orden

-------------------------------------------------------------------------------------------------------------------------------------

## Integrantes

- Yhojan Andres Caro Gonzalez
- Johan Sebastian Gonzalez Cartagena
