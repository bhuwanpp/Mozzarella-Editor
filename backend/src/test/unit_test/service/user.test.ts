import bcrypt from "bcrypt";
import expect from "expect";
import { default as Sinon, default as sinon } from "sinon";
import { ROLE } from "../../../enums/role";
import ConflictError from "../../../error/ConflictError";
import NotFoundError from "../../../error/NotFoundError";
import { UserModel } from "../../../model/user";
import { signup } from "../../../service/auth";
import * as UserService from "../../../service/user";
import { getUserById } from "../../../service/user";

describe("User Service Test Suite", () => {
  // get userbyid unit  test
  describe("getUserById", () => {
    let userModelGetUserByIdStub: sinon.SinonStub;
    beforeEach(() => {
      userModelGetUserByIdStub = sinon.stub(UserModel, "getUserById");
    });
    afterEach(() => {
      userModelGetUserByIdStub.restore();
    });
    it("Should throw error user id not found", () => {
      userModelGetUserByIdStub.returns(undefined);
      expect(() => getUserById("2")).toThrow(
        new NotFoundError(`User with id 2 does not exist`)
      );
    });
    it("Should return usser if user is found", () => {
      const user = {
        userId: "1",
        name: "test",
        email: "test@test.com",
        password: "test1234",
        role: ROLE.USER,
      };
      userModelGetUserByIdStub.returns(user);
      const response = getUserById("1");
      expect(response).toStrictEqual(user);
    });
  });

  // create user unit test
  describe("createUser", () => {
    let bcryptHashStub: sinon.SinonStub;
    let userModelCreateUserStub: sinon.SinonStub;
    beforeEach(() => {
      bcryptHashStub = sinon.stub(bcrypt, "hash");
      userModelCreateUserStub = sinon.stub(UserModel, "createUser");
    });
    afterEach(() => {
      bcryptHashStub.restore();
      userModelCreateUserStub.restore();
    });
    it("Should create new user", async () => {
      bcryptHashStub.resolves("hashedPassword");
      const user = {
        userId: "1",
        name: "test",
        email: "test@test.com",
        password: "test1234",
        role: ROLE.USER,
      };
      await signup(user);
      expect(bcryptHashStub.callCount).toBe(1);
      expect(bcryptHashStub.getCall(0).args).toStrictEqual([user.password, 10]);
      expect(userModelCreateUserStub.callCount).toBe(1);

      expect(userModelCreateUserStub.getCall(0).args).toStrictEqual([
        {
          ...user,
          password: "hashedPassword",
        },
      ]);
    });
    it("Should throw error if user already exists", async () => {
      bcryptHashStub.resolves("hashedPassword");

      const user = {
        userId: "1",
        name: "test",
        email: "test@test.com",
        password: "test1234",
        role: ROLE.USER,
      };

      userModelCreateUserStub.rejects(new ConflictError("User already exists"));
      await expect(signup(user)).rejects.toThrowError("User already exists");
      expect(bcryptHashStub.callCount).toBe(1);
      expect(bcryptHashStub.getCall(0).args).toStrictEqual([user.password, 10]);
      expect(userModelCreateUserStub.callCount).toBe(1);
      expect(userModelCreateUserStub.getCall(0).args).toStrictEqual([
        {
          ...user,
          password: "hashedPassword",
        },
      ]);
    });
  });
  //unit test for login
  //

  // unit test for get all users
  describe("getUsers", () => {
    let userModelGetUsersStub: sinon.SinonStub;
    beforeEach(() => {
      userModelGetUsersStub = sinon.stub(UserModel, "getUsers");
    });
    afterEach(() => {
      userModelGetUsersStub.restore();
    });
    it("Should show all the user", () => {
      const query = { q: "searchQuery" };
      const expectedUsers = [
        {
          userId: "1",
          name: "user1",
          email: "one@gmail.com",
          password:
            "$2b$10$/.Fh4GGQrIZsZTBtTctgne6Hz9HkHX9NVPrW5fDU/6YbT8A7kP9PC",
          role: ROLE.ADMIN,
        },
        {
          userId: "2",
          name: "user2",
          email: "two@gmail.com",
          password:
            "$2b$10$/.Fh4GGQrIZsZTBtTctgne6Hz9HkHX9NVPrW5fDU/6YbT8A7kP9PC",
          role: ROLE.USER,
        },
      ];
      userModelGetUsersStub.returns(expectedUsers);
      const result = UserModel.getUsers(query);

      expect(userModelGetUsersStub.calledOnceWith(query)).toBeTruthy();
      expect(result).toEqual(expectedUsers);
      expect(userModelGetUsersStub.callCount).toBe(1);
      expect(userModelGetUsersStub.getCall(0).args).toStrictEqual([query]);
    });
  });

  // unit test for get user by getUserByEmail
  /**Get User By Email Test case */
  describe("getUserByEmail", () => {
    let userModelGetUserByEmail: Sinon.SinonStub;
    beforeEach(() => {
      userModelGetUserByEmail = sinon.stub(UserModel, "getUserByEmail");
    });
    afterEach(() => {
      userModelGetUserByEmail.restore();
    });
    it("Should return user if user is found", () => {
      const user = {
        id: "1",
        name: "user1",
        email: "one@gamil.com",
        password: "test123",
        role: ROLE.ADMIN,
      };
      userModelGetUserByEmail.returns(user);
      const response = UserService.getUserByEmail(user.email);
      expect(response).toStrictEqual(user);
      expect(userModelGetUserByEmail.callCount).toBe(1);
      expect(userModelGetUserByEmail.getCall(0).args).toStrictEqual([
        user.email,
      ]);
    });
    it("Should return null if user not found", () => {
      userModelGetUserByEmail.returns(null);
      const response = UserService.getUserByEmail("random@gmail.com");
      expect(response).toStrictEqual(null);
      expect(userModelGetUserByEmail.callCount).toBe(1);
      expect(userModelGetUserByEmail.getCall(0).args).toStrictEqual([
        "random@gmail.com",
      ]);
    });
  });
  // unit test for update user

  /**Update User Test Case*/
  describe("updateUser", () => {
    let userModelUpdateUserStub: Sinon.SinonStub;
    let utilsHashPasswordStub: Sinon.SinonStub;
    let userModelGetUserByIdStub: Sinon.SinonStub;
    beforeEach(() => {
      Sinon.restore();
      utilsHashPasswordStub = sinon.stub(bcrypt, "hash");
      userModelUpdateUserStub = sinon.stub(UserModel, "updateUser");
      userModelGetUserByIdStub = sinon.stub(UserModel, "getUserById");
    });

    afterEach(() => {
      userModelUpdateUserStub.restore();
      utilsHashPasswordStub.restore();
      userModelGetUserByIdStub.restore();
    });
    it("Should throw error user id not found", () => {
      userModelGetUserByIdStub.returns(undefined);
      expect(() => getUserById("1")).toThrow(
        new NotFoundError(`User with id 1 does not exist`)
      );
    });

    it("Should update user", async () => {
      const userId = "0";
      utilsHashPasswordStub.resolves("hashedPassword");
      const user = {
        userId: userId,
        name: "Updated Name",
        email: "updatedemail@gmail.com",
        password: "newpassword",
        role: ROLE.USER,
      };

      const existingUser = { ...user, password: "oldpassword" };
      const hashedPassword = "hashedPassword";
      const updatedUser = { ...user, password: hashedPassword };

      userModelGetUserByIdStub.resolves(existingUser);
      utilsHashPasswordStub.resolves("hashedPassword");
      userModelUpdateUserStub.returns(updatedUser);

      existingUser.password = user.password;
      const response = await UserService.updateUser(userId, existingUser);

      expect(utilsHashPasswordStub.callCount).toBe(1);
      expect(utilsHashPasswordStub.getCall(0).args).toStrictEqual([
        user.password,
        10,
      ]);

      expect(response).toStrictEqual(updatedUser);
      expect(userModelUpdateUserStub.callCount).toBe(1);
      expect(userModelUpdateUserStub.getCall(0).args).toStrictEqual([
        userId,
        updatedUser,
      ]);
    });
  });
  // unit test for delete user

  describe("UserService.deleteUser", () => {
    let userModelGetUserByIdStub: sinon.SinonStub;
    let userModelDeleteUserStub: sinon.SinonStub;

    beforeEach(() => {
      sinon.restore();
      userModelGetUserByIdStub = sinon.stub(UserModel, "getUserById");
      userModelDeleteUserStub = sinon.stub(UserModel, "deleteUser");
    });

    afterEach(() => {
      sinon.restore();
      userModelDeleteUserStub.restore();
      userModelGetUserByIdStub.restore();
    });
    it("Should throw error user id not found", () => {
      userModelGetUserByIdStub.returns(undefined);
      expect(() => getUserById("1")).toThrow(
        new NotFoundError(`User with id 1 does not exist`)
      );
    });
    it("Should delete user if user exists", async () => {
      const userId = "2";
      const user = {
        userId: userId,
        name: "User One",
        email: "one@gmail.com",
        password: "hashedPassword",
        role: "user",
      };

      userModelGetUserByIdStub.resolves(user);
      userModelDeleteUserStub.resolves(user);

      const response = await UserService.deleteUser(userId);

      expect(response).toStrictEqual(user);
      expect(userModelGetUserByIdStub.callCount).toBe(1);
      expect(userModelGetUserByIdStub.getCall(0).args).toStrictEqual([userId]);
      expect(userModelDeleteUserStub.callCount).toBe(1);
      expect(userModelDeleteUserStub.getCall(0).args).toStrictEqual([userId]);
    });
  });
});
