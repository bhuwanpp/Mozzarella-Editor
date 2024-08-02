import axios from "axios";
import {
  fetchFilesFromBackend,
  getAccessToken,
  initializeLocalStorage,
} from "../editor/fileOperations";
import { INewUser, IupdateUser, User } from "../interface/user";
import { afterLoginUI, showAllUsersBtn } from "../main";
import { AfterLoginFunction, loginBackFunction, removeLogin } from "./authUi";
import { onUserLogin, onUserLogout } from "./interceptor";

const loginError = document.getElementById(
  "loginError"
) as HTMLParagraphElement;

export async function logOutFunction() {
  localStorage.removeItem("userCredentials");
  AfterLoginFunction();
  await initializeLocalStorage();
  onUserLogout();
}

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

    const expiresIn = addedUser.expiresIn || 120;
    const expirationTime = Date.now() + expiresIn * 1000;
    console.log(expirationTime);

    const userArray = [accessToken, refresthToken, name, expirationTime];
    localStorage.setItem("userCredentials", JSON.stringify(userArray));
    AfterLoginFunction();
    removeLogin();
    fetchFilesFromBackend();
    onUserLogin();
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

// Function to check if token is expired
export const isTokenExpired = (): boolean => {
  const userCredentials = localStorage.getItem("userCredentials");
  if (!userCredentials) return true;

  const [, , , expirationTime] = JSON.parse(userCredentials);
  return Date.now() >= expirationTime;
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
    alert("you are succesfully signup ");
    console.log("POST: user is registered", registeredUser);
    loginBackFunction();
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
    return response.data;
  } catch (error: any) {
    console.error("Error updating password:", error);
    loginError.textContent = error.response.data.message;
    setTimeout(() => {
      loginError.textContent = "";
    }, 3000);
    throw error;
  }
}

// me router
export async function afterLoginShow() {
  const accessToken = getAccessToken();
  try {
    const response = await axios.get("http://localhost:3000/auth/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result = response.data.message;
    console.log(result);
    if (result === "Verified") {
      console.log("it verified");
      afterLoginUI.appendChild(showAllUsersBtn);
    }
  } catch (error) {
    console.error("Error fetching admin  route:", error);
    afterLoginUI.removeChild(showAllUsersBtn);
    throw error;
  }
}
