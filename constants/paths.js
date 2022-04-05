const paths = {
    users: () => "users",
    invited: (uid) => `users/${uid}/invited`,
    items: (uid) => `users/${uid}/items`,
}

module.exports = paths;