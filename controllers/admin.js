const express = require('express')
const router = express.Router()
const AdminJS = require('adminjs')
const db = require("../models")

const AdminJSSequelize = require('@adminjs/sequelize')
module.exports = router.get('/admin',(req, res, next) => {
    AdminJS.registerAdapter(AdminJSSequelize)
    res.send("Bienvenu")
})
