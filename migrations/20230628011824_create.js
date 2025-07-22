/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  await knex.schema.createTable("room_types", (table) => {
    table.increments("id");
    table.string("name").notNullable().defaultTo("default");
    table.boolean("public").defaultTo(false); // false if can be created only by admins
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.dropTable("room_types");
};
