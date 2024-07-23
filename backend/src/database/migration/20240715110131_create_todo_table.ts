import { Knex } from 'knex';

const TABLE_NAME = 'todos';


/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements();
    table.string('todo', 100).notNullable()
    table.integer('user_id').notNullable()
    table.foreign('user_id').references('user_id').inTable('users')


    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));

    table
      .bigInteger('created_by')
      .unsigned()
      .nullable()
      .references('user_id')
      .inTable('users');

    table.timestamp('updated_at').nullable();

    table
      .bigInteger('updated_by')
      .unsigned()
      .references('user_id')
      .inTable('users')
      .nullable();
  });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
