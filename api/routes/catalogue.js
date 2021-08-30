const express = require("express");
const router = express.Router()
const User = require('../models/user')
const Catalogue = require('../models/catalogue')

const bcrypt = require('bcrypt')
const rounds = 10

const jwt = require('jsonwebtoken')
const tokenSecret = "my-token-secret"

const middleware = require('../middleware')

const catalogue = require("../models/catalogue");

router.get('/catalogue', async (req, res) => {
    // this can be done only by customers
    const products = await Catalogue.find()
    // this will fetch all items from catalogue
    res.status(200).json(products)
})


router.post('/addItemToCatalogue', (req, res) => {
    // This can be done only by admin

    const newCat = Catalogue({
        itemName: req.body.itemName,
        CategoryName: req.body.CategoryName,
        Addresses: req.body.Addresses,
    })
    newCat.save().then(cat => {
        res.status(200).json(cat)
    })
        .catch(error => {
            console.log(error)
            res.status(500).json(error)
        })

    // this will save a item to a catalogue
})




module.exports = router;