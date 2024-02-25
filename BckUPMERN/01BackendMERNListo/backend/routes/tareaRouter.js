import express from 'express'
import { obtenerTarea, agregarTarea, actualizarTarea,eliminarTarea, cambiarEstado } from '../controllers/tareaController.js'
import checkAuth from '../middleware/checkAuth.js'


const router = express.Router()

router.route('/:id')
    .get(checkAuth,obtenerTarea)
    .put(checkAuth,actualizarTarea)
    .delete(checkAuth,eliminarTarea)

router.post('/', checkAuth, agregarTarea)
router.post('/estado/:id', checkAuth, cambiarEstado)

export default router
