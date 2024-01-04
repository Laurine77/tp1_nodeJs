const express = require('express');
const app = express();
const pool = require("./database/database");
const cors = require('cors');
const path = require('path');

// Récupération des routes
const usersRoutes = require('./routes/usersRoutes');
const technoRoutes = require('./routes/technoRoutes');
const commentaireRoutes = require('./routes/commentaireRoute');

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Appel des routes
app.use('/user', usersRoutes);
app.use('/technologie', technoRoutes);
app.use('/commentaire', commentaireRoutes);

app.listen(8000, function () {
    console.log('Serveur ouvert sur le port 8000');
});

