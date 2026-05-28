/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username", 24).notNullable().unique();
    table.string("salt").notNullable();
    table.string("hash").notNullable();
    table.boolean("isAdmin").notNullable().defaultTo(false);
    table.string("display_name", 32).notNullable();
    table.string("color").notNullable().defaultTo("#acdbd6");
    table.string("sprite_key").notNullable().defaultTo("default");
    table.integer("last_room_id").unsigned().nullable();
    table.integer("last_x").unsigned().notNullable().defaultTo(0);
    table.integer("last_y").unsigned().notNullable().defaultTo(0);
    table.string("facing").notNullable().defaultTo("down");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("room_types", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.boolean("is_public").notNullable().defaultTo(false);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("rooms", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.string("slug").notNullable().unique();
    table.integer("capacity").unsigned().notNullable().defaultTo(25);
    table.integer("width").unsigned().notNullable();
    table.integer("height").unsigned().notNullable();
    table.integer("spawn_x").unsigned().notNullable().defaultTo(0);
    table.integer("spawn_y").unsigned().notNullable().defaultTo(0);
    table.integer("room_type_id").unsigned().nullable();
    table.integer("owner_user_id").unsigned().nullable();
    table.boolean("is_public").notNullable().defaultTo(true);
    table.timestamps(true, true);

    table
      .foreign("room_type_id")
      .references("id")
      .inTable("room_types")
      .onDelete("SET NULL");
    table
      .foreign("owner_user_id")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
  });

  await knex.schema.createTable("room_tiles", (table) => {
    table.increments("id").primary();
    table.integer("room_id").unsigned().notNullable();
    table.integer("x").unsigned().notNullable();
    table.integer("y").unsigned().notNullable();
    table.string("kind").notNullable().defaultTo("floor");
    table.boolean("blocked").notNullable().defaultTo(false);
    table.integer("target_room_id").unsigned().nullable();
    table.integer("target_x").unsigned().nullable();
    table.integer("target_y").unsigned().nullable();
    table.timestamps(true, true);

    table.unique(["room_id", "x", "y"]);
    table.foreign("room_id").references("id").inTable("rooms").onDelete("CASCADE");
    table
      .foreign("target_room_id")
      .references("id")
      .inTable("rooms")
      .onDelete("SET NULL");
  });

  const [defaultRoomTypeId] = await knex("room_types").insert({
    name: "default",
    is_public: true,
  });

  await knex("rooms").insert({
    name: "lobby",
    slug: "lobby",
    capacity: 25,
    width: 20,
    height: 12,
    spawn_x: 0,
    spawn_y: 0,
    room_type_id: Number(defaultRoomTypeId),
  });

  await knex.schema.alterTable("users", (table) => {
    table
      .foreign("last_room_id")
      .references("id")
      .inTable("rooms")
      .onDelete("SET NULL");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.dropTableIfExists("room_tiles");
  await knex.schema.dropTableIfExists("rooms");
  await knex.schema.dropTableIfExists("room_types");
  await knex.schema.dropTableIfExists("users");
};
