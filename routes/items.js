var express = require('express');
var router = express.Router();
var { items } = require('../firebase');
var paths = require('../constants/paths');



router.post('/add', async function (req, res) {
    try {
        const itemsToAdd = getItemsFromReq(req);
        const uid = getUIDFromReq(req);
        if (!uid || (Object.keys(uid).length === 0 && Object.getPrototypeOf(uid) === Object.prototype)) { // Todo add as interceptor
            res.status(400).send({ ex: 'uid is invalid' });
            return;
        }
        const path = paths.items(uid);
        let result = await items.addAll(path, itemsToAdd);
        res.status(200);
        res.send(result);
    } catch (ex) {
        console.log(ex);
        res.status(500).send(ex);
    }
});

router.post('/remove', async function (req, res) {
    const invitedToRemove = getPeopleFromReq(req);
    const uid = getUIDFromReq(req);
    const path = paths.invited(uid);
    const removedInvited = await firebase.remove(path, invitedToRemove);
    res.status(200).send(removedInvited);
});

router.post('/update', async function (req, res) {
    const invitedToRemove = getPeopleFromReq(req);
    res.status(200).res.send(invitedToRemove);
});

router.get('/getAll', async function (req, res) {
    try {
        const uid = getUIDFromReq(req);
        const path = paths.items(uid);
        const result = await items.getAll(path);
        res.status(200).send(result);
    } catch (ex) {
        res.status(500).send(ex);
    }

});

const getItemsFromReq = (req) => req?.body?.items ? req?.body?.items : {};

const getUIDFromReq = (req) => req?.headers?.uid ? req?.headers?.uid : {};

module.exports = router;