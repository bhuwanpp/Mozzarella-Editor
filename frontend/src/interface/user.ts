export interface User {
  email: string;
  password: string;
}
export interface INewUser {
  name: string;
  email: string;
  password: string;
}

export interface IupdateUser {
  email: string;
  oldPassword: string;
  newPassword: string;
}
