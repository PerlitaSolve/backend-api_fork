const express = require('express');
const {poblarProductos} = require('../controllers/externalController');
const {poblarCategoria} = require('../controllers/externalController');
const {anadirCategoria} = require('../controllers/externalController');
const {buscarProducto}= require('../controllers/externalController');
const {buscarCategoria} = require('../controllers/externalController');
const {mostrar} = require('../controllers/externalController');
const router = express.Router();

router.post('/poblarProducts', poblarProductos);
router.post('/poblarCategoria', poblarCategoria);
router.post('/anadirCategoria', anadirCategoria);
router.get('/buscarProducto/:busqueda', buscarProducto);
router.get ('/buscarCategoria/:busqueda', buscarCategoria);
router.get('/mostrarProductos', mostrar);


module.exports = router;