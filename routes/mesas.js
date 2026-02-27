const express = require('express');
const router = express.Router();

const API_KEY = "123";
const validarApiKey = (req, res, next) => {
    const apiKey = req.headers['api'];
    if (!apiKey) return res.status(401).json({ success: false, message: "API Key requerida" });
    if (apiKey !== API_KEY) return res.status(403).json({ success: false, message: "API Key incorrecta" });
    next();
};

let mesas = [
    { id: 1, numero: 1, capacidad: 4, estado: "disponible" },
    { id: 2, numero: 2, capacidad: 2, estado: "ocupada" },
    { id: 3, numero: 3, capacidad: 6, estado: "disponible" }
];

router.get('/', validarApiKey, (req, res) => {
    const filtros = req.query;
    let data = mesas;
    if (Object.keys(filtros).length > 0) {
        data = mesas.filter(m =>
            Object.entries(filtros).every(([k, v]) =>
                m[k]?.toString().toLowerCase().includes(v.toLowerCase())
            )
        );
    }
    res.status(200).json({ success: true, total: data.length, data });
});

router.get('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);
    const mesa = mesas.find(m => m.id === id);
    if (!mesa) return res.status(404).json({ success: false, message: "Mesa no encontrada" });
    res.status(200).json({ success: true, data: mesa });
});

router.post('/', validarApiKey, (req, res) => {
    const { numero, capacidad, estado } = req.body;
    if (!numero || !capacidad || !estado) return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });

    const nueva = { id: mesas.length + 1, numero, capacidad, estado };
    mesas.push(nueva);
    res.status(201).json({ success: true, message: "Mesa creada correctamente", data: nueva });
});

router.put('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);
    const mesa = mesas.find(m => m.id === id);
    if (!mesa) return res.status(404).json({ success: false, message: "Mesa no encontrada" });

    const { numero, capacidad, estado } = req.body;
    mesa.numero = numero || mesa.numero;
    mesa.capacidad = capacidad || mesa.capacidad;
    mesa.estado = estado || mesa.estado;

    res.status(200).json({ success: true, message: "Mesa actualizada correctamente", data: mesa });
});

router.delete('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);
    const index = mesas.findIndex(m => m.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: "Mesa no encontrada" });

    const eliminado = mesas.splice(index, 1);
    res.status(200).json({ success: true, message: "Mesa eliminada correctamente", data: eliminado[0] });
});

module.exports = router;