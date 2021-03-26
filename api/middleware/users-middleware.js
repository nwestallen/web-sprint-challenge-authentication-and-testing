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
    next();
};

module.exports = {
    checkUserPayload,
    checkUsernameAvailability
};