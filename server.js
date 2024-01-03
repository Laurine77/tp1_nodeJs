const express = require('express')
const app = express()
const pool = require("./database")
const cors = require('cors')
const path = require('path')

//middleware
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));// permet d'appeler mon fichier index.html qui se trouve dans le dossier public

//creation du CRUD

app.get('/utilisateur', function(req, res){
    pool.query('SELECT * FROM utilisateur', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs :', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
        } else {
            res.status(200).json(results);
        }
    });
})

app.get('/utilisateur/:nom', function(req, res){
    console.log('page utilisateur nom')
    let nom = req.params.nom
    pool.query('SELECT * FROM utilisateur WHERE nom = ?', [nom], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'utilisateur par nom :', err);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur par nom' });
        } else {
            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
        }
    });
})

app.post('/utilisateur/ajout', async (req, res) => {
    console.log('page utilisateur ajout')
    try {
        const { nom, prenom, email } = req.body;
        await pool.query('INSERT INTO utilisateur (nom, prenom, email) VALUES (?, ?, ?)', [nom, prenom, email]);
        res.status(200).json('Utilisateur ajouté');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur' });
    }
})

app.put('/utilisateur/modification/:id', async (req, res) => {
    console.log('page utilisateur modification')
    try {
        let id = req.params.id;
        const { nom, prenom, email } = req.body;
        await pool.query('UPDATE utilisateur SET nom=?, prenom=?, email=? WHERE id=?', [nom, prenom, email, id]);
        res.status(200).json('Utilisateur mis à jour');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
})

app.delete('/utilisateur/suppression/:id', async (req, res) => {
    console.log('page utilisateur suppression')
    let id = req.params.id;
    await pool.query('DELETE FROM utilisateur WHERE id=?', [id]);
    res.status(200).json('Utilisateur supprimé');
})

//afficher commentaire 
app.get('/commentaire', function(req, res){
    pool.query('SELECT * FROM commentaire', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs :', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
        } else {
            res.status(200).json(results);
        }
    });
})
app.listen(8000, function(){
    console.log('serveur ouvert sur le port 8000')
})
