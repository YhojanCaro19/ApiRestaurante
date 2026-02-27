const express = require('express');
const router = express.Router();

const API_KEY = "123";
const validarApiKey = (req, res, next) => {
    const apiKey = req.headers['api'];
    if (!apiKey) return res.status(401).json({ success: false, message: "API Key requerida" });
    if (apiKey !== API_KEY) return res.status(403).json({ success: false, message: "API Key incorrecta" });
    next();
};

let ingredientes = [
    { id: 1, nombre: "Carne", stock: 50, unidad: "kg" },
    { id: 2, nombre: "Queso", stock: 30, unidad: "kg" },
    { id: 3, nombre: "Lechuga", stock: 20, unidad: "kg" }
];

router.get('/', validarApiKey, (req, res) => {
    const filtros = req.query;
    let data = ingredientes;

    if (Object.keys(filtros).length > 0) {
        data = ingredientes.filter(i =>
            Object.entries(filtros).every(([k, v]) =>
                i[k]?.toString().toLowerCase().includes(v.toLowerCase())
            )
        );
    }

    res.status(200).json({ success: true, total: data.length, data });
});

router.get('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);
    const ingrediente = ingredientes.find(i => i.id === id);
    if (!ingrediente) return res.status(404).json({ success: false, message: "Ingrediente no encontrado" });
    res.status(200).json({ success: true, data: ingrediente });
});

router.post('/', validarApiKey, (req, res) => {
    const { nombre, stock, unidad } = req.body;
    if (!nombre || !stock || !unidad) return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });

    const nuevo = { id: ingredientes.length + 1, nombre, stock, unidad };
    ingredientes.push(nuevo);
    res.status(201).json({ success: true, message: "Ingrediente creado correctamente", data: nuevo });
});

router.put('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);
    const ingrediente = ingredientes.find(i => i.id === id);
    if (!ingrediente) return res.status(404).json({ success: false, message: "Ingrediente no encontrado" });

    const { nombre, stock, unidad } = req.body;
    ingrediente.nombre = nombre || ingrediente.nombre;
    ingrediente.stock = stock || ingrediente.stock;
    ingrediente.unidad = unidad || ingrediente.unidad;

    res.status(200).json({ success: true, message: "Ingrediente actualizado correctamente", data: ingrediente });
});

router.delete('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);
    const index = ingredientes.findIndex(i => i.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: "Ingrediente no encontrado" });

    const eliminado = ingredientes.splice(index, 1);
    res.status(200).json({ success: true, message: "Ingrediente eliminado correctamente", data: eliminado[0] });
});

module.exports = router;