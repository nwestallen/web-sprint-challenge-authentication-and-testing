const db = require('../../data/dbConfig');

const getAll = () => {
    return db('users');
};

const getById = (id) => {
    return db('users').where({ id }).first();
};

const getByUsername = (username) => {
    return db('users').where('username', username).first();
};

const add = async user => {
    const [id] = await db('users').insert(user)
    return getById(id);
};

module.exports = {
    getAll,
    getById,
    add,
    getByUsername
};