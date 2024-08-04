import { afterLogin, afterLoginUI, login, signup } from "../main";

const nameField = document.getElementById("name") as HTMLInputElement;
const alreadyLogin = document.getElementById("already-login") as HTMLDivElement;
const signupWrapper = document.getElementById(
  "signupWrapper"
) as HTMLDivElement;
const password = document.getElementById("password") as HTMLInputElement;
const authInfo = document.getElementById("authInfo") as HTMLParagraphElement;
export const continueBtn = document.getElementById(
  "continueBtn"
) as HTMLInputElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const loginUi = document.getElementById("loginUi") as HTMLDivElement;
const updatePasswordForm = document.getElementById(
  "updatePasswordForm"
) as HTMLFormElement;

/**
 * Displays the signup form and related UI elements, while hiding the login form.
 */
export function signupBtnFunctions() {
  nameField.style.display = "block";
  alreadyLogin.style.display = "flex";
  signupWrapper.style.display = "none";
  login.style.display = "none";
  signup.style.display = "block";
}

/**
 * Hides the signup form and displays the login form and related UI elements.
 */
export function loginBackFunction() {
  nameField.style.display = "none";
  alreadyLogin.style.display = "none";
  signup.style.display = "none";
  login.style.display = "block";
  signupWrapper.style.display = "flex";
}

/**
 * Resets the UI to its initial state before login or signup.
 */
export function resetFunction() {
  password.style.display = "block";
  authInfo.style.display = "block";
  login.style.display = "block";
  signup.style.display = "none";
  nameField.style.display = "none";
  alreadyLogin.style.display = "none";
  signupWrapper.style.display = "flex";
  continueBtn.style.display = "none";
}

/**
 * Hides the login UI.
 */
export function removeLogin() {
  loginUi.style.display = "none";
}

/**
 * Updates the UI after a successful login.
 * If user credentials are found in localStorage, it displays the username.
 * Otherwise, it shows the login button and hides the after-login UI.
 */
export function AfterLoginFunction() {
  const userCredentialsString = localStorage.getItem("userCredentials");
  if (userCredentialsString) {
    const userCredentials = JSON.parse(userCredentialsString) as [
      string,
      string,
      string
    ];
    const name: string = userCredentials[2];
    loginBtn.style.display = "none";
    afterLogin.style.display = "block";
    afterLogin.textContent = name;
  } else {
    afterLoginUI.style.display = "none";
    loginBtn.style.display = "block";
    afterLogin.style.display = "none";
  }
}

/**
 * Displays the update password form.
 */
export function updatePasswordUi() {
  updatePasswordForm.style.display = "block";
}
