
exports.seed = async knex => {
    await knex('users').insert([
        { username: 'OldUser', password: '$2a$08$9I6OT0Peu9BnP09duYQVLO145wDeJP3SOQAdioA5Wuz7lnCPE.2gW'}
    ])
};