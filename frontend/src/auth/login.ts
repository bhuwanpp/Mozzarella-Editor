import axios from "axios";
import {
  fetchFilesFromBackend,
  getAccessToken,
} from "../editor/fileOperations";
import { INewUser, IupdateUser, User } from "../interface/user";
import { AfterLoginFunction, removeLogin } from "./authUi";

const loginError = document.getElementById(
  "loginError"
) as HTMLParagraphElement;

// login user
export const loginUser = async (user: User) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/login",
      user,
      { timeout: 100000 }
    );
    const addedUser = response.data;
    const { accessToken, refresthToken, name } = addedUser;
    const userArray = [accessToken, refresthToken, name];
    localStorage.setItem("userCredentials", JSON.stringify(userArray));
    AfterLoginFunction();
    removeLogin();
    fetchFilesFromBackend();
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      loginError.textContent = "Request timed out";
    } else {
      loginError.textContent = error.response.data.message;
    }
    setTimeout(() => {
      loginError.textContent = "";
    }, 3000);
  }
};

// Register user function
export const registerUser = async (newUser: INewUser) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/signup",
      newUser,
      { timeout: 10000 }
    );
    const registeredUser = response.data;

    console.log("POST: user is registered", registeredUser);
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
    } else {
      loginError.textContent = error.response.data.message;
      setTimeout(() => {
        loginError.textContent = "";
      }, 3000);
    }
  }
};

//update user
export async function updatePasswordFunction(user: IupdateUser) {
  const accessToken = getAccessToken();
  try {
    const response = await axios.put("http://localhost:3000/users", user, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Password updated successfully");
    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}
