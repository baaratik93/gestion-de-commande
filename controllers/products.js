const { Product } = require('../models')
const express = require('express')
const { generateError, FoundProduct } = require('../helpers')
const router = express.Router()
/** Afficher tous les produits */
exports.products = router.get('/products', async (req, res, next) => {
    try {
        const articles = await Product.findAll()
        res.status(200).json(articles)
    } catch (error) {
        res.send(error)
    }

})

/** Ajouter un nouveau produit */
exports.addProduct = router.post('/products/new', async (req, res, next) => {
    !req.body && res.status(404).json({ erreur: "Votre saisie est vide" })
    try {
        /** Création de l'article */
        await Product
            .create({
                name: req.body.name,
                type: req.body.type,
                quantity: req.body.quantity,
                price: req.body.price
            })
            .then(article => res.status(201).json({ msg: `${article.type} ${article.name} ajouté avec succès` }))
            .catch(e => { e && res.status(409).json({ erreur: generateError(e) }) })

    } catch (e) {
        console.log("Erreur", e)
    }
})

/** Chercher un produit */
exports.product = router.get('/products/:id', async (req, res, next) => {
    const article = await FoundProduct(req.params.id)
    article ? res.status(200).json(article) : res.status(404).json({ erreur: "Ce produit n'existe pas" })
})

exports.EditProduct = router.put('/products/:id/edit', async (req, res, next) => {
    const article = await Product
        .findOne({
            where: {
                id: req.params.id
            }
        })
    try {
        article
            .update({
                name: req.body.name,
                type: req.body.type,
                quantity: req.body.quantity,
                price: req.body.price
            })
            .then(article => res.status(201).json(article))
    } catch (error) {
        res.json({erreur: "Produit inexistant"})
    }
})

exports.DeleteProduct =
    router.delete('/products/:id/delete', async (req, res, next) => {
        await Product
            .destroy({ where: { id: req.params.id } })
            .then(a => a === 1 ? res.status(200).json({ msg: "Supprimé avec succès" }) : res.status(404).json({ erreur: "Ce produit n'existe pas" }))
            .catch(() => res.status(404).json({ erreur: "Ce produit n'existe pas" }))

    })