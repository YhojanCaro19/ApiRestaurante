const express = require('express');
const router = express.Router();

const API_KEY = "123";
const validarApiKey = (req, res, next) => {
    const apiKey = req.headers['api'];
    if (!apiKey) return res.status(401).json({ success: false, message: "API Key requerida" });
    if (apiKey !== API_KEY) return res.status(403).json({ success: false, message: "API Key incorrecta" });
    next();
};

let platos = [
    { id: 1, nombre: "Hamburguesa", precio: 18000, categoria: "Rápida" },
    { id: 2, nombre: "Pizza", precio: 25000, categoria: "Italiana" },
    { id: 3, nombre: "Ensalada César", precio: 15000, categoria: "Saludable" }
];

router.get('/', validarApiKey, (req, res) => {
    const filtros = req.query;
    let data = platos;
    if (Object.keys(filtros).length > 0) {
        data = platos.filter(p =>
            Object.entries(filtros).every(([k, v]) =>
                p[k]?.toString().toLowerCase().includes(v.toLowerCase())
            )
        );
    }
    res.status(200).json({ success: true, total: data.length, data });
});

router.get('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);
    const plato = platos.find(p => p.id === id);
    if (!plato) return res.status(404).json({ success: false, message: "Plato no encontrado" });
    res.status(200).json({ success: true, data: plato });
});

router.post('/', validarApiKey, (req, res) => {
    const { nombre, precio, categoria } = req.body;
    if (!nombre || !precio || !categoria) return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });

    const nuevo = { id: platos.length + 1, nombre, precio, categoria };
    platos.push(nuevo);
    res.status(201).json({ success: true, message: "Plato creado correctamente", data: nuevo });
});

router.put('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);
    const plato = platos.find(p => p.id === id);
    if (!plato) return res.status(404).json({ success: false, message: "Plato no encontrado" });

    const { nombre, precio, categoria } = req.body;
    plato.nombre = nombre || plato.nombre;
    plato.precio = precio || plato.precio;
    plato.categoria = categoria || plato.categoria;

    res.status(200).json({ success: true, message: "Plato actualizado correctamente", data: plato });
});

router.delete('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);
    const index = platos.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: "Plato no encontrado" });

    const eliminado = platos.splice(index, 1);
    res.status(200).json({ success: true, message: "Plato eliminado correctamente", data: eliminado[0] });
});

module.exports = router;