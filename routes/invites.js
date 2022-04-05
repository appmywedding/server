var express = require('express');
var router = express.Router();
var paths = require('../constants/paths');
const { invited } = require('../firebase');


router.post('/add', async function (req, res) {
    try {
        const invitedToAdd = getPeopleFromReq(req);
        const uid = getUIDFromReq(req);
        if (!uid || (Object.keys(uid).length === 0 && Object.getPrototypeOf(uid) === Object.prototype)) {
            res.status(400).send({ ex: 'uid is null' });
            return;
        }
        const path = paths.invited(uid);
        let newInvited = await invited.addAll(path, invitedToAdd);
        res.status(200);
        res.send(newInvited);
    } catch (ex) {
        res.status(500).send(ex);
    }
});

router.post('/remove', async function (req, res) {
    const invitedToRemove = getPeopleFromReq(req);
    const uid = getUIDFromReq(req);
    const path = paths.invited(uid);
    const removedInvited = await invited.remove(path, invitedToRemove);
    res.status(200).send(removedInvited);
});

router.post('/update', async function (req, res) {
    const invitedToRemove = getPeopleFromReq(req);
    res.status(200).res.send(invitedToRemove);
});

router.get('/getAll', async function (req, res) {
    try {
        const uid = getUIDFromReq(req);
        const path = paths.invited(uid);
        const result = await invited.getAll(path);
        res.status(200).send(result);
    } catch (ex) {
        res.status(500).send(ex);
    }

});

const getPeopleFromReq = (req) => req?.body?.people ? req?.body?.people : {};

const getUIDFromReq = (req) => req?.headers?.uid ? req?.headers?.uid : {};

module.exports = router;