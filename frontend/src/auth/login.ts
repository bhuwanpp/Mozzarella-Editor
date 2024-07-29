import axios from "axios";
import { AfterLoginFunction, login, removeLogin, signup } from "./authUi";
const email = document.getElementById("email") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;
const name = document.getElementById("name") as HTMLInputElement;

interface User {
  email: string;
  password: string;
}

login.addEventListener("click", async (e) => {
  e.preventDefault();

  const user = {
    email: email.value,
    password: password.value,
  };
  try {
    await loginUser(user);
    email.value = "";
    password.value = "";
  } catch (error) {
    console.error("Error during login:", error);
  }
});

const loginUser = async (user: User) => {
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
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
    } else {
      console.error(error);
    }
  }
};

signup.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log("Sign Up clicked");

  const newUser = {
    name: name.value,
    email: email.value,
    password: password.value,
  };

  try {
    await registerUser(newUser);
    name.value = "";
    email.value = "";
    password.value = "";
  } catch (error) {
    console.error("Error during sign up:", error);
  }
});
interface INewUser {
  name: string;
  email: string;
  password: string;
}
// Register user function
const registerUser = async (newUser: INewUser) => {
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
      console.error("Registration error:", error);
    }
  }
};
