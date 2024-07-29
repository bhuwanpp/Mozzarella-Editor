const singnUpBtn = document.getElementById("signupBtn") as HTMLButtonElement;
const nameField = document.getElementById("name") as HTMLInputElement;
const forgotPassword = document.getElementById("forgotp") as HTMLButtonElement;
const alreadyLogin = document.getElementById("already-login") as HTMLDivElement;
const loginBack = document.getElementById("loginback") as HTMLButtonElement;
const signupWrapper = document.getElementById(
  "signupWrapper"
) as HTMLDivElement;
const password = document.getElementById("password") as HTMLInputElement;
const authInfo = document.getElementById("authInfo") as HTMLParagraphElement;
const forgotInfo = document.getElementById(
  "forgotInfo"
) as HTMLParagraphElement;
export const login = document.getElementById("login") as HTMLInputElement;
export const signup = document.getElementById("signup") as HTMLInputElement;
export const continueBtn = document.getElementById(
  "continueBtn"
) as HTMLInputElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const loginUi = document.getElementById("loginUi") as HTMLDivElement;

singnUpBtn?.addEventListener("click", () => {
  signupBtnFunctions();
});

function signupBtnFunctions() {
  nameField.style.display = "block";
  forgotPassword.style.display = "none";
  alreadyLogin.style.display = "flex";
  signupWrapper.style.display = "none";
  login.style.display = "none";
  signup.style.display = "block";
}
loginBack.addEventListener("click", () => {
  loginBackFunction();
});

function loginBackFunction() {
  nameField.style.display = "none";
  forgotPassword.style.display = "block";
  alreadyLogin.style.display = "none";
  signupWrapper.style.display = "flex";
}
forgotPassword.addEventListener("click", () => {
  forgotPaswordFunction();
});
function forgotPaswordFunction() {
  nameField.style.display = "none";
  forgotPassword.style.display = "none";
  alreadyLogin.style.display = "none";
  signupWrapper.style.display = "none";
  password.style.display = "none";
  authInfo.style.display = "none";
  forgotInfo.style.display = "block";
  login.style.display = "none";
  signup.style.display = "none";
  continueBtn.style.display = "block";
}
function resetFunction() {
  password.style.display = "block";
  authInfo.style.display = "block";
  forgotInfo.style.display = "none";
  login.style.display = "block";
  signup.style.display = "none";
  nameField.style.display = "none";
  forgotPassword.style.display = "block";
  alreadyLogin.style.display = "none";
  signupWrapper.style.display = "flex";
}

let loginUiVisible = false;
loginBtn.addEventListener("click", () => {
  loginUiVisible = !loginUiVisible;
  loginUi.style.display = loginUiVisible ? "block" : "none";
  resetFunction();
});

document.addEventListener("click", (event) => {
  const target = event.target as Node;
  if (loginUiVisible && !loginUi.contains(target) && target !== loginBtn) {
    loginUi.style.display = "none";
    loginUiVisible = false;
  }
});

document.addEventListener("keydown", (e: any) => {
  if (e.key === "Escape") {
    removeLogin();
  }
});
export function removeLogin() {
  loginUi.style.display = "none";
}
const afterLogin = document.getElementById("afterLogin") as HTMLButtonElement;
const afterLoginUI = document.getElementById(
  "afterLoginUI"
) as HTMLButtonElement;
const logOut = document.getElementById("logOut") as HTMLButtonElement;

let afterloginVisible = false;
export function AfterLoginFunction() {
  const userCredentialsString: any = localStorage.getItem("userCredentials");
  if (userCredentialsString) {
    const userCredentials: any = JSON.parse(userCredentialsString);
    const name = userCredentials[2];
    loginBtn.style.display = "none";
    afterLogin.style.display = "block";
    afterLogin.textContent = name;
  } else {
    afterLoginUI.style.display = "none";
    loginBtn.style.display = "block";
    afterLogin.style.display = "none";
  }
}
afterLogin.addEventListener("click", () => {
  console.log("it comes here");
  afterloginVisible = !afterloginVisible;
  console.log("afterlogin", afterloginVisible);
  afterLoginUI.style.display = afterloginVisible ? "block" : "none";
});

AfterLoginFunction();
logOut.addEventListener("click", () => {
  localStorage.removeItem("userCredentials");
  AfterLoginFunction();
});
document.addEventListener("click", (event) => {
  const target = event.target as Node;
  if (afterloginVisible && !afterLogin.contains(target) && target !== logOut) {
    afterLoginUI.style.display = "none";
    afterloginVisible = false;
  }
});

document.addEventListener("keydown", (e: any) => {
  if (e.key === "Escape") {
    afterLoginUI.style.display = "none";
  }
});
