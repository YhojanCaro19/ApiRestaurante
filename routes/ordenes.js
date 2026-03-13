const express = require('express');
const router  = express.Router();
const db      = require('../db');

const API_KEY = "123";
const validarApiKey = (req, res, next) => {
    const apiKey = req.headers['api'];
    if (!apiKey)            return res.status(401).json({ success: false, message: "API Key requerida" });
    if (apiKey !== API_KEY) return res.status(403).json({ success: false, message: "API Key incorrecta" });
    next();
};

const normalizar = (str) =>
    str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const ESTADOS_VALIDOS = ['En preparación', 'Entregada', 'Cancelada'];

const estadoValido = (estado) =>
    ESTADOS_VALIDOS.some(e => normalizar(e) === normalizar(estado));

const normalizarEstado = (estado) =>
    ESTADOS_VALIDOS.find(e => normalizar(e) === normalizar(estado));

router.get('/', validarApiKey, (req, res) => {
    const { estado } = req.query;
    let sql    = 'SELECT * FROM ordenes';
    let params = [];

    if (estado) {
        sql    += ' WHERE estado = ?';
        params  = [normalizarEstado(estado) ?? estado];
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(200).json({ success: true, total: rows.length, data: rows });
    });
});

router.get('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);

    db.get('SELECT * FROM ordenes WHERE id = ?', [id], (err, orden) => {
        if (err)    return res.status(500).json({ success: false, message: err.message });
        if (!orden) return res.status(404).json({ success: false, message: "Orden no encontrada" });

        db.all(
            `SELECT p.id, p.nombre, p.precio, op.cantidad
             FROM orden_platos op
             JOIN platos p ON p.id = op.plato_id
             WHERE op.orden_id = ?`,
            [id],
            (err, platos) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.status(200).json({ success: true, data: { ...orden, platos } });
            }
        );
    });
});

router.post('/', validarApiKey, (req, res) => {
    const { mesaId, platos, total, estado } = req.body;

    if (!mesaId || !platos || !total || !estado)
        return res.status(400).json({ success: false, message: "mesaId, platos, total y estado son obligatorios" });

    if (!Number.isInteger(Number(mesaId)) || Number(mesaId) <= 0)
        return res.status(400).json({ success: false, message: "mesaId debe ser un entero mayor a 0" });
    if (isNaN(total) || Number(total) < 0)
        return res.status(400).json({ success: false, message: "total debe ser un número mayor o igual a 0" });
    if (!estadoValido(estado))
        return res.status(400).json({ success: false, message: "estado debe ser: En preparacion, Entregada o Cancelada" });
    if (!Array.isArray(platos) || platos.length === 0)
        return res.status(400).json({ success: false, message: "platos debe ser un arreglo con al menos un elemento" });

    const estadoFinal = normalizarEstado(estado); 

    db.get('SELECT id FROM mesas WHERE id = ?', [mesaId], (err, mesa) => {
        if (err)   return res.status(500).json({ success: false, message: err.message });
        if (!mesa) return res.status(404).json({ success: false, message: "La mesa indicada no existe" });

        db.run(
            'INSERT INTO ordenes (mesaId, total, estado) VALUES (?, ?, ?)',
            [mesaId, Number(total), estadoFinal],
            function(err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                const ordenId = this.lastID;

                const stmt = db.prepare('INSERT INTO orden_platos (orden_id, plato_id, cantidad) VALUES (?, ?, ?)');
                for (const item of platos) {
                    stmt.run([ordenId, item.plato_id, item.cantidad]);
                }
                stmt.finalize();

                res.status(201).json({ success: true, message: "Orden creada correctamente", data: { id: ordenId, mesaId, platos, total: Number(total), estado: estadoFinal } });
            }
        );
    });
});

router.put('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);

    db.get('SELECT * FROM ordenes WHERE id = ?', [id], (err, orden) => {
        if (err)    return res.status(500).json({ success: false, message: err.message });
        if (!orden) return res.status(404).json({ success: false, message: "Orden no encontrada" });

        const mesaId = req.body.mesaId ?? orden.mesaId;
        const total  = req.body.total  ?? orden.total;
        const estado = req.body.estado ?? orden.estado;

        if (isNaN(total) || Number(total) < 0)
            return res.status(400).json({ success: false, message: "total debe ser un número mayor o igual a 0" });
        if (!estadoValido(estado))
            return res.status(400).json({ success: false, message: "estado debe ser: En preparacion, Entregada o Cancelada" });

        const estadoFinal = normalizarEstado(estado);

        db.run(
            'UPDATE ordenes SET mesaId = ?, total = ?, estado = ? WHERE id = ?',
            [mesaId, Number(total), estadoFinal, id],
            function(err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.status(200).json({ success: true, message: "Orden actualizada correctamente", data: { id, mesaId, total: Number(total), estado: estadoFinal } });
            }
        );
    });
});

router.delete('/:id', validarApiKey, (req, res) => {
    const id = parseInt(req.params.id);

    db.get('SELECT * FROM ordenes WHERE id = ?', [id], (err, orden) => {
        if (err)    return res.status(500).json({ success: false, message: err.message });
        if (!orden) return res.status(404).json({ success: false, message: "Orden no encontrada" });

        db.run('DELETE FROM orden_platos WHERE orden_id = ?', [id], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            db.run('DELETE FROM ordenes WHERE id = ?', [id], (err) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.status(200).json({ success: true, message: "Orden eliminada correctamente", data: orden });
            });
        });
    });
});

module.exports = router;