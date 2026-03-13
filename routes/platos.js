const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
    const { categoria } = req.query;
    let sql    = 'SELECT * FROM platos';
    let params = [];
    if (categoria) { sql += ' WHERE categoria = ?'; params = [categoria]; }
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(200).json({ success: true, total: rows.length, data: rows });
    });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM platos WHERE id = ?', [id], (err, row) => {
        if (err)  return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: "Plato no encontrado" });
        res.status(200).json({ success: true, data: row });
    });
});

router.post('/', (req, res) => {
    const { nombre, precio, categoria } = req.body;
    if (!nombre || !precio || !categoria)
        return res.status(400).json({ success: false, message: "nombre, precio y categoria son obligatorios" });
    if (isNaN(precio) || Number(precio) <= 0)
        return res.status(400).json({ success: false, message: "precio debe ser un número mayor a 0" });
    db.run('INSERT INTO platos (nombre, precio, categoria) VALUES (?, ?, ?)', [nombre, Number(precio), categoria],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(201).json({ success: true, message: "Plato creado correctamente", data: { id: this.lastID, nombre, precio: Number(precio), categoria } });
        }
    );
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM platos WHERE id = ?', [id], (err, plato) => {
        if (err)    return res.status(500).json({ success: false, message: err.message });
        if (!plato) return res.status(404).json({ success: false, message: "Plato no encontrado" });
        const nombre    = req.body.nombre    ?? plato.nombre;
        const precio    = req.body.precio    ?? plato.precio;
        const categoria = req.body.categoria ?? plato.categoria;
        if (isNaN(precio) || Number(precio) <= 0)
            return res.status(400).json({ success: false, message: "precio debe ser un número mayor a 0" });
        db.run('UPDATE platos SET nombre = ?, precio = ?, categoria = ? WHERE id = ?', [nombre, Number(precio), categoria, id],
            function(err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.status(200).json({ success: true, message: "Plato actualizado correctamente", data: { id, nombre, precio: Number(precio), categoria } });
            }
        );
    });
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM platos WHERE id = ?', [id], (err, plato) => {
        if (err)    return res.status(500).json({ success: false, message: err.message });
        if (!plato) return res.status(404).json({ success: false, message: "Plato no encontrado" });
        db.run('DELETE FROM platos WHERE id = ?', [id], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(200).json({ success: true, message: "Plato eliminado correctamente", data: plato });
        });
    });
});

module.exports = router;