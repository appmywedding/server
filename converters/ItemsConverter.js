const invitedConverter = {
    toFirestore: function (items) {
        return {
            dj: items.dj.id,
        };
    },
    fromFirestore: function (snapshot, options = {}) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            name: data.name,
            number: data.number,
            isActive: data.isActive,
        }
    }
}

module.exports = invitedConverter