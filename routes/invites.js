var express = require('express');
var router = express.Router();
var data = require('../data');
var db = require('../firebase');
var paths = require('../constants/paths');
var { people } = require('../data');


router.post('/add', async function (req, res) {
    try {
        const invitedToAdd = getPeopleFromReq(req);
        const uid = getUIDFromReq(req);
        if (!uid || (Object.keys(uid).length === 0 && Object.getPrototypeOf(uid) === Object.prototype)) {
            res.status(400).send({ ex: 'uid is null' });
            return;
        }
        const path = paths.invited(uid);
        let newInvited = await db.addAll(path, invitedToAdd);
        res.status(200);
        res.send(newInvited);
    } catch (ex) {
        console.log(ex);
        res.status(500).send(ex);
    }
});

router.post('/remove', async function (req, res) {
    const invitedToRemove = getPeopleFromReq(req);
    const auth = getUIDFromReq(req);
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
        const uid = getUIDFromReq(req);
        const path = paths.invited(uid);
        const invited = await db.getAll(path);
        console.log(invited)
        res.status(200).send(invited);
    } catch (ex) {
        res.status(500).send(ex);
    }

});

const getPeopleFromReq = (req) => req?.body?.people ? req?.body?.people : {};

const getUIDFromReq = (req) => req?.headers?.uid ? req?.headers?.uid : {};

module.exports = router;