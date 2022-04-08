const userConverter = {
    toFirestore: function (user) {
        return {
            uid: user.uid,
            role: user.role,
        };
    },
    fromFirestore: function (snapshot, options = {}) {
        const data = snapshot.data(options);
        return {
            uid: snapshot.id,
            role: data.role,
        };
    },
};

module.exports = userConverter