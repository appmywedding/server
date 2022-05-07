const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const { QuerySnapshot } = require('firebase-admin/firestore');
const invitedConverter = require('./converters/InvitedConverter');
const ItemsConverter = require('./converters/ItemsConverter');
const userConverter = require('./converters/UserConverter');
const credentials = require('./mywedding-3c67a-firebase-adminsdk-s1dgf-cfb413af27.json');
const { get } = require('./routes');
const { firestore } = require('firebase-admin');


const app = initializeApp({ credential: cert(credentials), storageBucket: 'gs://mywedding-3c67a.appspot.com/' });
const db = getFirestore();
const storage = getStorage();

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


const invited = {
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


const userItems = {
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
        data.forEach((item) => {
            item.isActive = true;
        })
        const collection = getCollectionRef(path);
        const batch = db.batch();
        dataList.forEach((dataRow) => {
            const doc = collection.doc(dataRow.name);
            batch.set(doc, dataRow, { merge: true });
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
        const userItems =
            await collectionRef
                .withConverter(ItemsConverter)
                .get()
                .catch((exception) => {
                    throw exception;
                });
        const items = {};
        const itemsData = userItems.data();
        console.log(itemsData)
        for (let i = 0; i < itemsData?.length; i += 1) {
            const item = itemsData[i];
            items[item.name] = {};
            let itemDocRef = getDocRef(`${item.name}/${item.id}`);
            items[item.name] = (await itemDocRef.get()).data();
        }
        console.log(items)
        return items;
    }
}

const user = {
    get: async (uid) => {
        const docRef = getDocRef(`users/${uid}`);
        let result
            = await docRef
                .withConverter(userConverter)
                .get()
                .catch((exception) => {
                    throw exception;
                });
        return result.data();
    }
}

const files = {
    upload: async (path, file) => {
        const bucket = storage.bucket();
        const bucketFile = bucket.file(path);
        await bucketFile.save(file.buffer, {
            contentType: file.mimetype,
            gzip: true
        });

        const [url] = await bucketFile.getSignedUrl({
            action: "read",
            expires: "01-01-2050"
        });
        return url;
    }
};

const items = {
    create: async (path, data) => {
        const doc = getCollectionRef(path).doc();
        await doc
            .create(data)
            .catch((error) => {
                return error;
            });
        return doc.id;
    },

    getAll: async (type) => {
        const collectionRef = getCollectionRef(type);
        const result = await collectionRef.get()
            .catch((error) => {
                return error;
            });
        const resultData = [...result.data()];
        let index = 0;
        result.docs.forEach((doc) => {
            resultData[index].id = doc.id;
            index += 1;
        });
        return resultData
    }

}

module.exports = {
    invited,
    userItems,
    user,
    files,
    items,
};

QuerySnapshot.prototype.data = function () {
    const data = [];
    for (let i = 0; i < this.docs.length; i += 1) {
        data.push(this.docs[i].data());
    }
    return data;
}