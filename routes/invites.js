var express = require('express');
var router = express.Router();
var data = require('../data');
var db = require('../firebase');
var paths = require('../constants/paths');


router.post('/add', async function (req, res) {
    try {
        const invitedToAdd = getPeopleFromReq(req);
        const auth = getAuthFromReq(req);
        const path = paths.invited(auth.uid);
        await db.addAll(path, invitedToAdd);
        res.status(200);
        res.send(data.people);
    } catch (ex) {
        res.status(500).send(ex);
    }
});

router.post('/remove', async function (req, res) {
    const invitedToRemove = getPeopleFromReq(req);
    const auth = getAuthFromReq(req);
    const path = paths.invited(auth.uid);
    res.status(200);
    res.send(invitedToRemove);
});

router.post('/update', async function (req, res) {
    const invitedToRemove = getPeopleFromReq(req);
    res.status(200);
    res.send(invitedToRemove);
});

router.get('/getAll', async function (req, res) {
    try {
        const auth = getAuthFromReq(req);
        console.log(req);
        const path = paths.invited(auth.uid);
        const invited = await db.getAll(path);
        console.log(invited);
        res.status(200).send(invited);
    } catch (ex) {
        res.status(500).send(ex);
    }

});

const getPeopleFromReq = (req) => req?.body?.people ? req?.body?.people : {};

const getAuthFromReq = (req) => req?.body?.auth ? req?.body?.auth : {};

module.exports = router;