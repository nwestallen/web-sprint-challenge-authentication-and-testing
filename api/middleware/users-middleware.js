const User = require('../users/users-model');

const checkUserPayload = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "username and password required" });
    } else {
        next();
    }
};

const checkUsernameAvailability = (req, res, next) => {
    User.getByUsername(req.body.username)
    .then(user => {
        if (user) {
            res.status(400).json({ message: "username taken" });
        } else {
            next();
        }
    })
    .catch(err => next(err));
};

module.exports = {
    checkUserPayload,
    checkUsernameAvailability
};