require("dotenv").config();
const express = require("express")
const router = express.Router()
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const isAuthenticated = require('../middlewares/authenticated')
const isAdmin = require('../middlewares/is-admin');
const { generateToken, generateError } = require('../helpers')


/**Permet d'afficher tous les utilisateur */
exports.users = router.get('/users', isAuthenticated, isAdmin, async (req, res, next) => {
    !req.user.userId && res.status(404).json({ erreur: "Veuillez vous connecter" })
    req.role !== 'admin' && res.json({ erreur: "Vous devez avoir une habilité d'administrateur" })
    try {
        const users = await User.findAll(/*{include: 'roled'}*/);
        users.length !== 0 ? res.status(200).json(users) : res.status(404).json({ erreur: "Aucun utilisateur trouvé" })
    } catch (error) {
        res.json(error)
    }
})


/**Ici l'inscription de l'utilisateur */
exports.register = router.post('/users/register', async (req, res, next) => {
    const { nom, username, password, email } = req.body
    try {

        bcrypt.hash(password, 10, async (error, hashed) => {
            error && console.log("Mot de passe non crypté")
            await User
                .create({
                    nom: nom,
                    username: username,
                    password: hashed,
                    email: email,
                    roleId: 1
                })
                .then(user => {
                    const key = user && generateToken(res, user)
                    key ? res.json({ token: key }) : res.json({ erreur: "Token non généré" })
                })
                .catch(e => e && console.error(e) || res.status(409).json({ erreur: generateError(e) }))
        })

    } catch (error) {
        res.json(error)
    }

})

/**Ici la connexion de l'utilisateur */
exports.sign = router.post('/users/signin', async (req, res, next) => {
    try {
        /**Verifier si l'utilisateur existe */
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        })
        !user && res.json({ erreur: "Login inexistant" })
        /**Verifier la validité du mot de passe */
        const connected = bcrypt.compareSync(req.body.password, user.password)
        /**Générer un token */
        const key = user && generateToken(res, user)
        /**Autoriser la connexion complète */
        connected && key ? res.status(200).json({ token: key, msg: "Connecté avec succès" }) : res.status(409).json({ erreur: "Token non généré", msg: "Mot de passe incorrect" })
    } catch (error) {
        console.log(error)
    }


})

/**Ici l'affichage d'un utilisateur */

exports.user = router.get('/users/:id', async (req, res, next) => {
    const user = await User.findOne({
        where: {
            id: req.params.id
        }
    })
    user ? res.status(200).json(user) : res.status(404).json({ erreur: "Ressource non existant" })

})

/**Ici la modification d'un utilisateur */

exports.EditUser = router.put('/users/:id/edit', async (req, res, next) => {
    const { nom, password, email } = req.body
    const user = await User.findOne({ where: { id: req.params.id } })

    try {
        user.update({
            nom: nom,
            email: email,
            password: await bcrypt.hashSync(password, 10)
        })
            .then(user => res.status(200).json(user))
            .catch(err => {
                res.status(404).json(err)
            })
    } catch (error) {
        console.log("Erreur", error)
    }

})


/**Ici la suppression d'un utilisateur */
exports.DeleteUser = router.delete('/users/:id/delete', async (req, res, next) => {
    try {

        const user = await User.destroy({ where: { id: req.params.id } })
        user === 1 ? res.status(200).json({ msg: "Utilisateur supprimé avec succès" }) : res.status(404).json({ erreur: "Utilisateur n'existe pas" })
    } catch (error) {

    }
})

