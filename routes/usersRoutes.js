const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes pour la table utilisateur
router.post('/add', userController.addUsers);
router.get('/all', userController.getAllUsers);
router.get('/userName/:nom', userController.getUsersName);
router.delete('/delete/:id', userController.deleteUsers);
router.put('/modification/:id', userController.updateUsers);
router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;

