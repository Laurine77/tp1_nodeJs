const express = require('express')
const router = express.Router()
const technoController = require('../controllers/technoController')
const middleware = require('../middleware/middleware')

// mettre les routes de notre table célébrité
router.post('/add', technoController.addTechno)
router.get('/all', technoController.getAllTechno)
router.put('/update', technoController.updateTechno)
router.delete('/delete', technoController.deleteTechno)
module.exports = router