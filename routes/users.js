var express = require('express');
var { user } = require('../firebase');
var router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        let result = await user.get(getUIDFromReq(req))
        res.status(200).send(result);
    } catch (ex) {
        res.status(500).send(ex)
    }
});

const getUIDFromReq = (req) => req?.headers?.uid ? req?.headers?.uid : {};


module.exports = router;
