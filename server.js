require("dotenv").config();
const express = require('express');
const app = express();
const { users, register, sign, EditUser, DeleteUser } = require('./controllers/users');
const { products, addProduct, EditProduct } = require('./controllers/products');
const { sequelize } = require("./models");
const path = require('path')

/** Parser les données */
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
/**Déclarer les dossiers statiques */
app.use(express.static(path.join(__dirname, '/public')))

//importer les routes
app.use(register);
app.use(sign);
app.use(users);
app.use(EditUser);
app.use(DeleteUser);

app.use(products);
app.use(addProduct);
app.use(EditProduct);

let port = process.env.PORT || 3001
app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log("Le serveur est lancé sur le port", port)
    } catch (e) {
        console.error("SGBD désactivé");
    }
})

