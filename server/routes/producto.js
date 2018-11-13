const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


//===============================
// Obtener todos los productos
//===============================
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate({
            path: 'categoria',
            populate: { path: 'usuario', select: 'nombre email' }
        })
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});


//===============================
// Obtener un producto por id
//===============================
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate usuario y categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate({
            path: 'categoria',
            populate: { path: 'usuario', select: 'nombre email' }
        })
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El id no existe en la BD"
                    }
                });
            }

            res.json({
                ok: true,
                producto
            });
        });
});

//===============================
// Buscar productos
//===============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            });
        })
});


//===============================
// Crear un producto
//===============================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            productoBD
        });
    })


});


//===============================
// Actualizar un producto
//===============================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    body.usuario = req.usuario._id;
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no fue encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto
        });
    });
    /* Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        producto.nombre = body.nombre;
        producto.precioUni = body.precioUni;
        producto.categoria = body.categoria;
        producto.disponible = body.disponible;
        producto.descripcion = body.descripcion;

        producto.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        })
    }); */

});


//===============================
// Borrar un producto
//===============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let bodyBorrado = { disponible: false };
    /*  Producto.findByIdAndUpdate(id, bodyBorrado, { new: true, runValidators: true, context: 'query' }, (err, producto) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 err
             });
         }

         if (!producto) {
             return res.status(400).json({
                 ok: false,
                 err: {
                     message: 'El id no existe'
                 }
             });
         }

         res.json({
             ok: true,
             producto,
             message: 'Producto: ' + producto.nombre + ' eliminado'
         });
     }); */

    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        producto.disponible = false;

        producto.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            });
        })
    });
});



module.exports = app;