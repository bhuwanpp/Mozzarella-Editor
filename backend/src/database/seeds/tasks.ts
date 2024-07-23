import { Knex } from 'knex';

const TABLE_NAME = 'todos';

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          todo: "Task 1 of User ",
          user_id: "1"
        },
        {
          todo: "Task 3 of User",
          user_id: "1"
        },
        {
          todo: "Task 2 of User ",
          user_id: "2"
        },
        {
          todo: "Task 4 of User ",
          user_id: "2"
        },
      ]);
    });
}
