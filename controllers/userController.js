const pool = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// CRUD utilisateurs

exports.getAllUsers = async (req, res) => {
    try {
        const sql = 'SELECT * FROM utilisateur';
        const results  = await pool.query(sql); 
        console.log('Results:', results); 
        res.status(200).json(results[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de tous les utilisateurs :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de tous les utilisateurs' });
    }
}

exports.getUsersName = async (req, res) => {
    try {
        const nom = req.params.nom;
        const results = await pool.query('SELECT * FROM utilisateur WHERE nom = ?', [nom]);

        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur par nom :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur par nom' });
    }
}

exports.addUsers = async (req, res) => {
    try {
        const { nom, prenom, email } = req.body;
        await pool.query('INSERT INTO utilisateur (nom, prenom, email) VALUES (?, ?, ?)', [nom, prenom, email]);
        res.status(200).json('Utilisateur ajouté');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur' });
    }
}

exports.updateUsers = async (req, res) => {
    try {
        const id = req.params.id;
        const { nom, prenom, email } = req.body;
        await pool.query('UPDATE utilisateur SET nom=?, prenom=?, email=? WHERE id=?', [nom, prenom, email, id]);
        res.status(200).json('Utilisateur mis à jour');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
}

exports.deleteUsers = async (req, res) => {
    try {
        const id = req.params.id;
        await pool.query('DELETE FROM utilisateur WHERE id=?', [id]);
        res.status(200).json('Utilisateur supprimé');
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
}

exports.register = async (req, res) => {
    try {
        const { nom, prenom, email, password } = req.body;
        const result = await pool.query('SELECT * from utilisateur where email =?', [email]);

        if (result.length > 0) {
            res.status(400).json({ error: 'Utilisateur déjà existant' });
        }

        const hashMDP = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO utilisateur (nom, prenom, email, password) VALUES (?, ?, ?, ?)', [nom, prenom, email, hashMDP]);

        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Erreur lors de l\'inscription de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription de l\'utilisateur' });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * from utilisateur where email = ?', [email]);

        if (result.length === 0) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        const utilisateur = result[0];
        const samePwd = await bcrypt.compare(password, utilisateur.password);

        if (!samePwd) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ email: utilisateur.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la connexion de l\'utilisateur' });
    }
}
