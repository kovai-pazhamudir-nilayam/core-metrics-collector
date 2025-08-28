exports.up = knex => {
  return knex
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(() => knex.schema.hasTable("user"))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable("user", table => {
          table
            .uuid("id")
            .primary()
            .notNullable()
            .defaultTo(knex.raw("uuid_generate_v4()"));
          table.string("full_name").unique();
          table.jsonb("phone_number");
        });
      }
      return false;
    });
};

exports.down = knex => {
  return knex.schema.dropTable("users");
};
