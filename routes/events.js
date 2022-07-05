/**
 * Rutas de eventos / Events
 * host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt')
const { getEventos, actualizarEvento, eliminarEvento, crearEvento } = require('../controllers/event');


const router = Router();

// Validar JWT
router.use(validarJWT);

// Obtener eventos
router.get('/', getEventos);

// Crear un evento
router.post(
    '/', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha fin es obligatoria').custom( isDate ),
        validarCampos,
        
    ],
    crearEvento
);

// Actualizar un evento
router.put('/:id', actualizarEvento);


// Actualizar un evento
router.delete('/:id', eliminarEvento);

module.exports = router;