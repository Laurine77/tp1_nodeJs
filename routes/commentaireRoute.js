const express = require('express')
const router = express.Router()
const commentaireController = require('../controllers/commentaireController')
const middleware = require('../middleware/middleware')

router.get('/commentaire', middleware.authenticator, middleware.isUser, commentaireController.getAllCommentaire);

router.post('/commentaire/add', middleware.authenticator, middleware.isJournalistOrAdmin, commentaireController.addCommentaire);
module.exports = router