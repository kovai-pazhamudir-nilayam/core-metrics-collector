exports.up = knex => {
  return knex.schema.hasTable("address").then(exists => {
    if (!exists) {
      return knex.schema.createTable("address", table => {
        table
          .uuid("id")
          .notNullable()
          .primary()
          .defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("country");
        table.string("state");
        table.timestamp("created_date_time").defaultTo(knex.fn.now());
        table.uuid("user_id").references("id").inTable("user");
      });
    }
    return false;
  });
};

exports.down = knex => {
  return knex.schema.dropTable("address");
};
