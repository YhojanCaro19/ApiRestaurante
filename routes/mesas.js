const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
    const { estado } = req.query;
    let sql    = 'SELECT * FROM mesas';
    let params = [];
    if (estado) { sql += ' WHERE estado = ?'; params = [estado]; }
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(200).json({ success: true, total: rows.length, data: rows });
    });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM mesas WHERE id = ?', [id], (err, row) => {
        if (err)  return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: "Mesa no encontrada" });
        res.status(200).json({ success: true, data: row });
    });
});

router.post('/', (req, res) => {
    const { numero, capacidad, estado } = req.body;
    if (!numero || !capacidad || !estado)
        return res.status(400).json({ success: false, message: "numero, capacidad y estado son obligatorios" });
    if (!Number.isInteger(Number(numero)) || numero <= 0)
        return res.status(400).json({ success: false, message: "numero debe ser un entero mayor a 0" });
    if (!Number.isInteger(Number(capacidad)) || capacidad < 1)
        return res.status(400).json({ success: false, message: "capacidad debe ser un entero mayor o igual a 1" });
    if (!['disponible', 'ocupada', 'reservada'].includes(estado))
        return res.status(400).json({ success: false, message: "estado debe ser: disponible, ocupada o reservada" });
    db.get('SELECT id FROM mesas WHERE numero = ?', [numero], (err, row) => {
        if (err)  return res.status(500).json({ success: false, message: err.message });
        if (row)  return res.status(400).json({ success: false, message: "Ya existe una mesa con ese número" });
        db.run('INSERT INTO mesas (numero, capacidad, estado) VALUES (?, ?, ?)', [numero, capacidad, estado],
            function(err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.status(201).json({ success: true, message: "Mesa creada correctamente", data: { id: this.lastID, numero, capacidad, estado } });
            }
        );
    });
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM mesas WHERE id = ?', [id], (err, mesa) => {
        if (err)   return res.status(500).json({ success: false, message: err.message });
        if (!mesa) return res.status(404).json({ success: false, message: "Mesa no encontrada" });
        const numero    = req.body.numero    ?? mesa.numero;
        const capacidad = req.body.capacidad ?? mesa.capacidad;
        const estado    = req.body.estado    ?? mesa.estado;
        if (!Number.isInteger(Number(numero)) || numero <= 0)
            return res.status(400).json({ success: false, message: "numero debe ser un entero mayor a 0" });
        if (!Number.isInteger(Number(capacidad)) || capacidad < 1)
            return res.status(400).json({ success: false, message: "capacidad debe ser un entero mayor o igual a 1" });
        if (!['disponible', 'ocupada', 'reservada'].includes(estado))
            return res.status(400).json({ success: false, message: "estado debe ser: disponible, ocupada o reservada" });
        db.run('UPDATE mesas SET numero = ?, capacidad = ?, estado = ? WHERE id = ?', [numero, capacidad, estado, id],
            function(err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.status(200).json({ success: true, message: "Mesa actualizada correctamente", data: { id, numero, capacidad, estado } });
            }
        );
    });
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM mesas WHERE id = ?', [id], (err, mesa) => {
        if (err)   return res.status(500).json({ success: false, message: err.message });
        if (!mesa) return res.status(404).json({ success: false, message: "Mesa no encontrada" });
        db.run('DELETE FROM mesas WHERE id = ?', [id], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(200).json({ success: true, message: "Mesa eliminada correctamente", data: mesa });
        });
    });
});

module.exports = router;