const invitedConverter = {
    toFirestore: function (invited) {
        return {
            id: invited.id,
            name: invited.name,
            number: invited.name,
            isActive: invited.isActive,
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