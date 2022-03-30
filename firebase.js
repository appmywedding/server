const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { QuerySnapshot } = require('firebase-admin/firestore');
const { invited } = require('./constants/paths');
const invitedConverter = require('./converters/InvitedConverter');
const credentials = require('./mywedding-3c67a-firebase-adminsdk-s1dgf-cfb413af27.json');


initializeApp({ credential: cert(credentials) });
const db = getFirestore();

// let app = firebaseApp.initializeApp(firebaseConfig);
// let db = firestore.getFirestore(app);

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
        const docRef = getDocRef(path);
        data['isActive'] = false;
        await db.updateDoc(docRef, data)
            .catch((exception) => { // if ex.code == unknown -> Internet problems
                throw exception;
            });
    },

    addAll: async (path, dataList) => {
        let data = dataList
        let retBody = [];
        if (!Array.isArray(dataList)) {
            data = [dataList]
        }
        data.forEach((invited) => {
            if (!invited.isActive) {
                invited.isActive = true;
            }
        })
        const collection = getCollectionRef(path);
        const batch = db.batch();
        dataList.forEach((dataRow) => {
            const doc = collection.doc();
            let dataRowWithID = dataRow;
            dataRowWithID.id = doc.id;
            batch.create(doc, dataRow);
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
                .withConverter(invitedConverter)
                .get()
                .catch((exception) => {
                    throw exception;
                });
        return res.data();
    }

}

module.exports = firebase;

// const firebaseConfig = {
//     apiKey: "AIzaSyDwNEwQ07GCio2bSOc5s2o6qthTzyzpO2Y",
//     authDomain: "mywedding-3c67a.firebaseapp.com",
//     projectId: "mywedding-3c67a",
//     storageBucket: "mywedding-3c67a.appspot.com",
//     messagingSenderId: "429876417546",
//     appId: "1:429876417546:web:a16b587455f9481e587bf3",
//     measurementId: "G-F7C241B8ML"
// };

QuerySnapshot.prototype.data = function () {
    const data = [];
    for (let i = 0; i < this.docs.length; i += 1) {
        data.push(this.docs[i].data());
    }
    return data;
}