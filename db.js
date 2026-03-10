const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Error conectando:', err.message);
  else console.log('Base de datos conectada');
});

db.serialize(() => {

  db.run(`CREATE TABLE IF NOT EXISTS mesas (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    numero    INTEGER NOT NULL UNIQUE,
    capacidad INTEGER NOT NULL CHECK(capacidad >= 1),
    estado    TEXT    NOT NULL DEFAULT 'disponible'
                      CHECK(estado IN ('disponible','ocupada','reservada'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS platos (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre    TEXT NOT NULL,
    precio    REAL NOT NULL CHECK(precio > 0),
    categoria TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ingredientes (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre  TEXT    NOT NULL,
    stock   INTEGER NOT NULL CHECK(stock >= 0),
    unidad  TEXT    NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ordenes (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    mesaId  INTEGER NOT NULL REFERENCES mesas(id),
    total   REAL    NOT NULL CHECK(total >= 0),
    estado  TEXT    NOT NULL DEFAULT 'En preparación'
                    CHECK(estado IN ('En preparación','Entregada','Cancelada'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orden_platos (
    orden_id  INTEGER NOT NULL REFERENCES ordenes(id),
    plato_id  INTEGER NOT NULL REFERENCES platos(id),
    cantidad  INTEGER NOT NULL CHECK(cantidad >= 1),
    PRIMARY KEY (orden_id, plato_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS plato_ingrediente (
    plato_id       INTEGER NOT NULL REFERENCES platos(id),
    ingrediente_id INTEGER NOT NULL REFERENCES ingredientes(id),
    cantidad       INTEGER NOT NULL CHECK(cantidad >= 1),
    PRIMARY KEY (plato_id, ingrediente_id)
  )`);

});

module.exports = db;