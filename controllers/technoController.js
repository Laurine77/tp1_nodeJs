const pool = require('../database/database')
require('dotenv').config()

//creation du CRUD users

exports.getAllTechno = async (req, res) => {
    const sql = 'SELECT * FROM technologie'
    const resultat = await pool.query(sql)
    res.status(200).json(resultat);
}

exports.addTechno = async (req, res) => {
    try {
        const { nom_techno, date_creation } = req.body
        await pool.query('INSERT INTO technologie (nom_techno, date_creation) VALUES (?, ?)', [nom_techno, date_creation]);
        res.status(200).json('Technologie ajouté');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la technologie :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la technologie' });
    }
}

exports.updateTechno = async (req, res) => {
    try {
        let id = req.params.id;
        const { nom_techno, date_creation } = req.body;
        await pool.query('UPDATE utilisateur SET nom_techno=?, date_creation=? WHERE id=?', [nom_techno, date_creation, id]);
        res.status(200).json('Technologie mise à jour');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la technologie :', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la technologie' });
    }
}

exports.deleteTechno = async (req, res) => {
    let id = req.params.id;
    await pool.query('DELETE FROM technologie WHERE id=?', [id]);
    res.status(200).json('Technologie supprimé');
}