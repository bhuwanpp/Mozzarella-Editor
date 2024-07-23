import { Knex } from 'knex';
import { ROLE } from '../../enums/role';

const TABLE_NAME = 'users';

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
          name: "user1",
          email: "one@gmail.com",
          password: "$2b$10$/.Fh4GGQrIZsZTBtTctgne6Hz9HkHX9NVPrW5fDU/6YbT8A7kP9PC",
          role: ROLE.ADMIN
        },
        {
          name: "user2",
          email: "two@gmail.com",
          password: "$2b$10$/.Fh4GGQrIZsZTBtTctgne6Hz9HkHX9NVPrW5fDU/6YbT8A7kP9PC",
          role: ROLE.USER
        },]);
    });
}
