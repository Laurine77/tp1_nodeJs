const express = require('express')
const router = express.Router()
const commentaireController = require('../controllers/commentaireController')
const middleware = require('../middleware/middleware')

//afficher commentaire 
exports.getAllCommentaire = async (req, res) => {
    pool.query('SELECT * FROM commentaire', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs :', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
        } else {
            res.status(200).json(results);
        }
    });
}

exports.addCommentaire = async (req, res) => {
    try {
        const { date_creation_commentaire, commentaire } = req.body;
        await pool.query('INSERT INTO commentaire (date_creation_commentaire, commentaire) VALUES (?, ?)', [date_creation_commentaire, commentaire]);
        res.status(200).json('commentaire ajouté');
    } catch (error) {
        console.error('Erreur lors de l\'ajout du commentaire :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire' });
    }
}