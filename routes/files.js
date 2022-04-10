var express = require('express');
var router = express.Router();
const { files } = require('../firebase');
const multer = require('multer');

const upload = multer();

router.post('/upload', upload.any(), async function (req, res, next) {
    try {
        const file = req.files[0];
        const { name } = req.body;
        const path = `${name}/${file.originalname}`
        const url = await files.upload(path, file);
        res.status(200).send(url);
    } catch (ex) {
        res.status(500).send(ex);
    }
});

const getItemsFromReq = (req) => req?.body?.items ? req?.body?.items : {};

const getUIDFromReq = (req) => req?.headers?.uid ? req?.headers?.uid : {};

module.exports = router;
