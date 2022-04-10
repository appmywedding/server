var express = require('express');
var router = express.Router();
var { items } = require('../firebase');

router.post('/create', function (req, res, next) {
    try {
        const { imageURL, type, title, description, price } = req.body;
        const data = {
            imageURL,
            title,
            description,
            price,
        };
        const path = type;
        const id = items.create(path, data);
        res.status(200).send(id);
    } catch (ex) {
        res.status(500).send(ex);
    }
});



router.get('/getAll/:type', async function (req, res, next) {
    try {
        const { type } = req.params;
        const result = await items.getAll(type);
        res.status(200).send(result);
    } catch (ex) {
        res.status(500).send(ex);
    }
});

module.exports = router;
