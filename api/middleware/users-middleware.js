const User = require('../users/users-model');

const checkUserPayload = (req, res, next) => {
    next();
};

const checkUsernameAvailability = (req, res, next) => {
    next();
};

module.exports = {
    checkUserPayload,
    checkUsernameAvailability
};