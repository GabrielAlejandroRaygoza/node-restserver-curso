const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//============================
//Mostrar todas las categorias
//============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });
});


//============================
//Mostrar una categoria por ID
//============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });

    }).populate('usuario', 'nombre email');

});


//============================
//Agregar una categoria por ID
//============================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let categoria = new Categoria();
    categoria.descripcion = body.descripcion;
    categoria.usuario = req.usuario._id;

    categoria.save((err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        })
    })
});


//============================
//Actualiza una categoria por ID
//============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});

//============================
//Actualiza una categoria por ID
//============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });
});




module.exports = app;