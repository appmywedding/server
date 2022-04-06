const invitedConverter = {
    toFirestore: function (items) {
        return {
            dj: items.dj.id,
        };
    },
    fromFirestore: function (snapshot, options = {}) {
        const data = snapshot.data(options);
        return {
            name: snapshot.id,
            id: data.id,
        }
    }
}

module.exports = invitedConverter