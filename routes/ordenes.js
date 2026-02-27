const express = require('express');
const router = express.Router();

const API_KEY = "123";
const validarApiKey = (req, res, next) => {
    const apiKey = req.headers['api'];
    if (!apiKey) return res.status(401).json({ success: false, message: "API Key requerida" });
    if (apiKey !== API_KEY) return res.status(403).json({ success: false, message: "API Key incorrecta" });
    next();
};

let ordenes = [
    { id: 1, mesaId: 2, platos: [1,2], total: 43000, estado: "En preparación" },
    { id: 2, mesaId: 1, platos: [3], total: 15000, estado: "Entregada" }
];

router.get('/', validarApiKey, (req, res) => {
    const filtros = req.query;
    let data = ordenes;
    if (Object.keys(filtros).length > 0) {
        data = ordenes.filter(o =>
            Object.entries(filtros).every(([k, v]) =>
                o[k]?.toString().toLowerCase().includes(v.toLowerCase())
            )
        );
    }
    res.status(200).json({ success: true, total: data.length, data });
});

router.get('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);
    const orden = ordenes.find(o => o.id === id);
    if (!orden) return res.status(404).json({ success: false, message: "Orden no encontrada" });
    res.status(200).json({ success: true, data: orden });
});

router.post('/', validarApiKey, (req, res) => {
    const { mesaId, platos, total, estado } = req.body;
    if (!mesaId || !platos || !total || !estado) return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });

    const nueva = { id: ordenes.length + 1, mesaId, platos, total, estado };
    ordenes.push(nueva);
    res.status(201).json({ success: true, message: "Orden creada correctamente", data: nueva });
});

router.put('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);
    const orden = ordenes.find(o => o.id === id);
    if (!orden) return res.status(404).json({ success: false, message: "Orden no encontrada" });

    const { mesaId, platos, total, estado } = req.body;
    orden.mesaId = mesaId || orden.mesaId;
    orden.platos = platos || orden.platos;
    orden.total = total || orden.total;
    orden.estado = estado || orden.estado;

    res.status(200).json({ success: true, message: "Orden actualizada correctamente", data: orden });
});

router.delete('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);
    const index = ordenes.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: "Orden no encontrada" });

    const eliminado = ordenes.splice(index, 1);
    res.status(200).json({ success: true, message: "Orden eliminada correctamente", data: eliminado[0] });
});

module.exports = router;