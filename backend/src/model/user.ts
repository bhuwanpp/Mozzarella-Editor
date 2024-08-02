import { ROLE } from "../enums/role";
import { GetUserQueryPage, User } from "../interfaces/user";
import { BaseModel } from "./base";

export class UserModel extends BaseModel {
  static async createUser(user: User) {
    const userToCreate = {
      name: user.name,
      email: user.email,
      password: user.password,
      role: ROLE.USER,
    };
    const query = await this.queryBuilder().insert(userToCreate).table("users");
    return query;
  }

  static async updateUser(email: string, newPassword: string) {
    try {
      await this.queryBuilder()
        .update({ password: newPassword })
        .table("users")
        .where({ email });
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Unable to update user password");
    }
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
    console.log("userid" + userId);
    const query = this.queryBuilder()
      .select("*")
      .table("users")
      .where({ userId })
      .first();
    return query;
  }

  static async getUserByEmail(email: string) {
    const query = await this.queryBuilder()
      .select("userId", "name", "email", "password", "role")
      .table("users")
      .where({ email })
      .first();
    return query;
  }

  static async deleteUser(userId: string) {
    const userToDelete = await this.queryBuilder()
      .select("role")
      .table("users")
      .where({ userId })
      .first();

    if (userToDelete && userToDelete.role === ROLE.ADMIN) {
      throw new Error('Cannot delete an admin user');
    }
    const query = await this.queryBuilder()
      .delete()
      .table("users")
      .where({ userId });
    return query;
  }
}
