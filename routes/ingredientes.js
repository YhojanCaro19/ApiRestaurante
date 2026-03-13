const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
    db.all('SELECT * FROM ingredientes', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(200).json({ success: true, total: rows.length, data: rows });
    });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM ingredientes WHERE id = ?', [id], (err, row) => {
        if (err)  return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: "Ingrediente no encontrado" });
        res.status(200).json({ success: true, data: row });
    });
});

router.post('/', (req, res) => {
    const { nombre, stock, unidad } = req.body;
    if (!nombre || stock === undefined || stock === null || !unidad)
        return res.status(400).json({ success: false, message: "nombre, stock y unidad son obligatorios" });
    if (!Number.isInteger(Number(stock)) || Number(stock) < 0)
        return res.status(400).json({ success: false, message: "stock debe ser un número entero mayor o igual a 0" });
    db.run('INSERT INTO ingredientes (nombre, stock, unidad) VALUES (?, ?, ?)', [nombre, Number(stock), unidad],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(201).json({ success: true, message: "Ingrediente creado correctamente", data: { id: this.lastID, nombre, stock: Number(stock), unidad } });
        }
    );
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM ingredientes WHERE id = ?', [id], (err, ingrediente) => {
        if (err)          return res.status(500).json({ success: false, message: err.message });
        if (!ingrediente) return res.status(404).json({ success: false, message: "Ingrediente no encontrado" });
        const nombre = req.body.nombre ?? ingrediente.nombre;
        const stock  = req.body.stock  ?? ingrediente.stock;
        const unidad = req.body.unidad ?? ingrediente.unidad;
        if (!Number.isInteger(Number(stock)) || Number(stock) < 0)
            return res.status(400).json({ success: false, message: "stock debe ser un número entero mayor o igual a 0" });
        db.run('UPDATE ingredientes SET nombre = ?, stock = ?, unidad = ? WHERE id = ?', [nombre, Number(stock), unidad, id],
            function(err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.status(200).json({ success: true, message: "Ingrediente actualizado correctamente", data: { id, nombre, stock: Number(stock), unidad } });
            }
        );
    });
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM ingredientes WHERE id = ?', [id], (err, ingrediente) => {
        if (err)          return res.status(500).json({ success: false, message: err.message });
        if (!ingrediente) return res.status(404).json({ success: false, message: "Ingrediente no encontrado" });
        db.run('DELETE FROM ingredientes WHERE id = ?', [id], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(200).json({ success: true, message: "Ingrediente eliminado correctamente", data: ingrediente });
        });
    });
});

module.exports = router;