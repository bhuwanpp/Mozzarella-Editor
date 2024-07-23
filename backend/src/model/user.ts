import { ROLE } from "../enums/role";
import { GetUserQueryPage, User } from "../interfaces/user";
import { BaseModel } from "./base";

export class UserModel extends BaseModel {
  static async createUser(user: User) {
    const userToCreate = {
      name: user.name,
      email: user.email,
      password: user.password,
      role: ROLE.USER
    };
    const query = await this.queryBuilder().insert(userToCreate).table("users");
    return query;
  }
  static async updateUser(id: string, user: User) {
    const userToUpdate = {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      updatedAt: new Date(),
    };
    const query = this.queryBuilder()
      .update(userToUpdate)
      .table("users")
      .where({ id });
    await query;
  }
  static getUsers(filter: GetUserQueryPage) {
    const { q } = filter;
    const query = this.queryBuilder()
      .select("userId", "name", "email")
      .table("users")
      .limit(filter.size)
      .offset((filter.page - 1) * filter.size);
    if (q) {
      query.whereLike("name", `%${q}%`);
    }
    return query;
  }
  static count(filter: GetUserQueryPage) {
    const { q } = filter;
    const query = this.queryBuilder().count("*").table("users").first();
    if (q) {
      query.whereLike("name", `%${q}%`);
    }
    return query;
  }
  static getUserById(userId: string) {
    console.log('userid' + userId)
    const query = this.queryBuilder()
      .select("*")
      .table("users")
      .where({ userId })
      .first();
    return query;
  }
  static getUserByEmail(email: string) {
    const query = this.queryBuilder().select('userId', 'name', 'email', 'password', 'role').table('users').where({ email }).first()

    console.log(query)
    return query;
  }

  static deleteUser(id: string) {
    const query = this.queryBuilder().delete().table("users").where({ id });
    return query;
  }
}

