
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'admin', password: '$2a$08$btTJqRPgHfKlDQUVWQrSU.nkDQvoQG/cMg5iff6SOVxvsbkbjBWNC'},

      ]);
    });
};
