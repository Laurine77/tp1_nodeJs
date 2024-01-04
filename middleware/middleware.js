const jwt = require('jsonwebtoken')
//const db = require('../database/database')
const pool = require('../database/database')
require('dotenv').config()

const getEmailFromToken = (token) => {
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return decoded.email
    } catch (error){
        return null;
    }
}

exports.authenticator = (req, res, next) => {
    // verifier le token 
    const token = req.params.token ? req.params.token : req.headers.authorization
    // décoder le token => next()
    if(token && process.env.SECRET_KEY){
        jwt.verify(token.process.env.SECRET_KEY, (err, decoded) => {
              //si prolbème => erreur
            if(err){
                res.status(401).json({erreur: 'acces refusé'})
            }
            else{
                console.log(decoded)
                next()
            }
        })
    }else {
        res.status(401).json({erreur: 'acces refusé'})
    }
}


exports.isAdmin = async (req, res, next) => {
    const token = req.query.token || req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Accès refusé' });
    }

    const email = getEmailFromToken(token);
    if (!email) {
        return res.status(401).json({ erreur: 'Accès refusé' });
    }

    try {
        const conn = await pool.getConnection();
        const result = await conn.query('SELECT role FROM utilisateur WHERE email = ?', [email]);
        conn.release();

        if (result.length > 0 && result[0].role === 'admin') {
            next();
        } else {
            return res.status(403).json({ erreur: 'Accès refusé' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Accès refusé' });
    }
};

    exports.isJournalistOrAdmin = (req, res, next) => {
        // Assurez-vous que l'utilisateur est authentifié
        if (!req.user) {
            return res.status(401).json({ erreur: 'Accès refusé, utilisateur non authentifié' });
        }

        // Vérifiez si l'utilisateur a le rôle de journaliste ou d'administrateur
        const userRole = req.user.role;

        if (userRole === 'journaliste' || userRole === 'admin') {
            // L'utilisateur a le bon rôle, continuez vers la route suivante
            next();
        } else {
            res.status(403).json({ erreur: 'Accès refusé, l\'utilisateur n\'a pas les permissions nécessaires' });
        }
    };

    exports.isUser = (req, res, next) => {
        // Assurez-vous que l'utilisateur est authentifié
        if (!req.user) {
            return res.status(401).json({ erreur: 'Accès refusé, utilisateur non authentifié' });
        }
    
        // Vérifiez si l'utilisateur a le rôle d'utilisateur
        const userRole = req.user.role;
    
        if (userRole === 'utilisateur') {
            // L'utilisateur a le bon rôle, continuez vers la route suivante
            next();
        } else {
            res.status(403).json({ erreur: 'Accès refusé, l\'utilisateur n\'a pas les permissions nécessaires' });
        }
    };
    