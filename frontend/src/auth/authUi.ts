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

export function signupBtnFunctions() {
  nameField.style.display = "block";
  alreadyLogin.style.display = "flex";
  signupWrapper.style.display = "none";
  login.style.display = "none";
  signup.style.display = "block";
}

export function loginBackFunction() {
  nameField.style.display = "none";
  alreadyLogin.style.display = "none";
  signup.style.display = "none";
  login.style.display = "block";
  signupWrapper.style.display = "flex";
}

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

export function removeLogin() {
  loginUi.style.display = "none";
}

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

export function updatePasswordUi() {
  updatePasswordForm.style.display = "block";
}
