const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { QuerySnapshot } = require('firebase-admin/firestore');
const { invited } = require('./constants/paths');
const invitedConverter = require('./converters/InvitedConverter');
const credentials = require('./mywedding-3c67a-firebase-adminsdk-s1dgf-cfb413af27.json');


initializeApp({ credential: cert(credentials) });
const db = getFirestore();

const getDocRef = (path) => {
    try {
        return db.doc(path);
    } catch (ex) {
        throw ex;
    }
};

const getCollectionRef = (path) => {
    try {
        return db.collection(path);
    } catch (ex) {
        throw ex;
    }
}


const firebase = {
    set: async (path, data) => {
        const docRef = getDocRef(path);

        await db.setDoc(docRef, data)
            .catch((exception) => {
                throw exception;
            });
    },

    update: async (path, data) => {
        const docRef = getDocRef(path);
        await db.updateDoc(docRef, data)
            .catch((exception) => {
                throw exception;
            });
    },

    remove: async (path, data) => {
        let retBody = [];
        const batch = db.batch();
        let dataList = data;
        if (!Array.isArray(data)) {
            dataList = [{ ...data }];
        } else {
            dataList = [...data];
        }
        for (let i = 0; i < dataList.length; i += 1) {
            const dataRow = dataList[i];
            dataRow.isActive = false;
            const docRef = getDocRef(`${path}/${dataRow.id}`);
            batch.update(docRef, dataRow);
            retBody.push(dataRow);
        }
        await batch.commit();
        return retBody;
    },

    addAll: async (path, dataList) => {
        let data = dataList
        let retBody = [];
        if (!Array.isArray(dataList)) {
            data = [dataList]
        }
        data.forEach((invited) => {
            invited.isActive = true;
        })
        const collection = getCollectionRef(path);
        const batch = db.batch();
        dataList.forEach((dataRow) => {
            const doc = collection.doc();
            batch.create(doc, dataRow);
            let dataRowWithID = { ...dataRow };
            dataRowWithID.id = doc.id;
            retBody.push(dataRowWithID);
        })
        await batch.commit();
        return retBody;
    },

    get: async (path) => {
        const docRef = getDocRef(path);
        const doc = await db.getDoc(docRef)
            .catch((exception) => {
                throw exception;
            });
        return doc.data();
    },

    getAll: async (path) => {
        const collectionRef = getCollectionRef(path);
        const res =
            await collectionRef
                .where("isActive", "==", true)
                .withConverter(invitedConverter)
                .get()
                .catch((exception) => {
                    throw exception;
                });
        return res.data();
    }

}

module.exports = firebase;

QuerySnapshot.prototype.data = function () {
    const data = [];
    for (let i = 0; i < this.docs.length; i += 1) {
        data.push(this.docs[i].data());
    }
    return data;
}