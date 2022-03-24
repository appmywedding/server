const paths = {
    users: () => "users",
    invited: (uid) => `users/${uid}/invited`,
}

module.exports = paths;