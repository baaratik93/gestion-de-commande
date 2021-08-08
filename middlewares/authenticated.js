const jwt = require("jsonwebtoken");
require('dotenv').config()

module.exports = function isAuthenticated(req, res, next) {
    const headers = req.headers.authorization;
    !headers && res.status(401).json({ Erreur: "Non autorisé" })
    const authHeader = headers.split(' ')
    const token = authHeader[1]
    jwt.verify(token, process.env.SECRET, (err, payload) => {
        err && res.status(409).json({ erreur: "Veuillez vous connecter d'abord" })
        req.user = payload
    })
    next()
}