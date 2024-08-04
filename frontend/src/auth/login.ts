import axios from "axios";
import { ERROR_TIME_OUT, LOGIN_TIME_OUT } from "../constants";
import {
  fetchFilesFromBackend,
  getAccessToken,
  initializeLocalStorage,
} from "../editor/fileOperations";
import {
  IErrorResponse,
  INewUser,
  IUser,
  IupdateUser,
} from "../interface/user";
import { afterLoginUI, showAllUsersBtn } from "../main";
import { AfterLoginFunction, loginBackFunction, removeLogin } from "./authUi";
import api, { onUserLogin, onUserLogout } from "./interceptor";

const loginError = document.getElementById(
  "loginError"
) as HTMLParagraphElement;

/**
 * Logs out the user by removing credentials from localStorage,
 * updating the UI, and initializing local storage.
 */
export async function logOutFunction() {
  localStorage.removeItem("userCredentials");
  AfterLoginFunction();
  await initializeLocalStorage();
  onUserLogout();
}

/**
 * Logs in a user by sending a POST request with user credentials.
 * If successful, stores the access and refresh tokens in localStorage
 * and updates the UI. Handles and displays login errors.
 * @param {IUser} user - The user credentials for login.
 */
export const loginUser = async (user: IUser) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/login",
      user,
      { timeout: LOGIN_TIME_OUT }
    );
    const addedUser = response.data;
    const { accessToken, refreshToken, name } = addedUser;

    const userArray = [accessToken, refreshToken, name];
    localStorage.setItem("userCredentials", JSON.stringify(userArray));
    AfterLoginFunction();
    removeLogin();
    fetchFilesFromBackend();
    onUserLogin();
  } catch (error: any) {
    const errorResponse = error.response?.data as IErrorResponse;
    if (error.code === "ECONNABORTED") {
      loginError.textContent = "Request timed out";
    } else {
      loginError.textContent = errorResponse?.message || "An error occurred";
    }
    setTimeout(() => {
      loginError.textContent = "";
    }, ERROR_TIME_OUT);
  }
};

/**
 * Checks if the access token has expired based on the expiration time stored in localStorage.
 * @returns {boolean} True if the token is expired, false otherwise.
 */
export const isTokenExpired = (): boolean => {
  const userCredentials = localStorage.getItem("userCredentials");
  if (!userCredentials) return true;

  const [, , , expirationTime] = JSON.parse(userCredentials);
  return Date.now() >= expirationTime;
};

/**
 * Registers a new user by sending a POST request with user details.
 * If successful, alerts the user and navigates back to the login screen.
 * @param {INewUser} newUser - The details of the new user to be registered.
 */
export const registerUser = async (newUser: INewUser) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/signup",
      newUser,
      { timeout: 10000 }
    );
    const registeredUser = response.data;
    alert("you are succesfully signup ");
    loginBackFunction();
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
    } else {
      const errorResponse = error.response?.data as IErrorResponse;
      loginError.textContent = errorResponse?.message || "An error occurred";
      setTimeout(() => {
        loginError.textContent = "";
      }, ERROR_TIME_OUT);
    }
  }
};

/**
 * Updates the user's password by sending a PUT request with updated user details.
 * @param {IupdateUser} user - The updated user details.
 * @returns {Promise<any>} The response data from the server.
 * @throws {Error} If the update request fails.
 */
export async function updatePasswordFunction(user: IupdateUser) {
  const accessToken = getAccessToken();
  try {
    const response = await axios.put("http://localhost:3000/users", user, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorResponse = error.response?.data as IErrorResponse;
    console.error("Error updating password:", error);
    loginError.textContent = errorResponse?.message || "An error occurred";
    setTimeout(() => {
      loginError.textContent = "";
    }, ERROR_TIME_OUT);
    throw error;
  }
}

/**
 * Fetches user details after login and shows additional UI elements if the user is verified.
 * Handles errors and removes UI elements if there is an issue.
 */
export async function afterLoginShow() {
  const accessToken = getAccessToken();
  try {
    const response = await api.get("/auth/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result = response.data.message;
    if (result === "Verified") {
      afterLoginUI.appendChild(showAllUsersBtn);
    }
  } catch (error) {
    console.error("Error fetching admin  route:", error);
    afterLoginUI.removeChild(showAllUsersBtn);
    throw error;
  }
}
