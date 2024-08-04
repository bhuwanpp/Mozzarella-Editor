import "./style.css";

import {
  AfterLoginFunction,
  loginBackFunction,
  removeLogin,
  resetFunction,
  signupBtnFunctions,
} from "./auth/authUi";
import {
  afterLoginShow,
  logOutFunction,
  loginUser,
  registerUser,
  updatePasswordFunction,
} from "./auth/login";
import { showAllUsersFunction } from "./auth/user";
import { astAutoComplete } from "./editor/autoComplete";
import { runCode } from "./editor/codeRunner";
import {
  addFile,
  currentFileName,
  defaultFileName,
  initializeLocalStorage,
  loadFile,
  saveFile,
} from "./editor/fileOperations";
import { updateLineNumbers } from "./editor/lineNumbers";
import {
  handleSelectionChange,
  highlightedCode,
  resizeTextarea,
  updateHighlighting,
} from "./highlight";
import { suggestions } from "./lsp";
import { errorsDiv } from "./lsp/errors";

const singnUpBtn = document.getElementById("signupBtn") as HTMLButtonElement;
const loginBack = document.getElementById("loginback") as HTMLButtonElement;
export const afterLogin = document.getElementById(
  "afterLogin"
) as HTMLButtonElement;
export const afterLoginUI = document.getElementById(
  "afterLoginUI"
) as HTMLButtonElement;
export const logOut = document.getElementById("logOut") as HTMLButtonElement;
export const addFileBtn = document.getElementById(
  "add-file"
) as HTMLButtonElement;
export const runBtn = document.getElementById("run") as HTMLButtonElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const loginUi = document.getElementById("loginUi") as HTMLDivElement;
export const login = document.getElementById("login") as HTMLInputElement;
export const signup = document.getElementById("signup") as HTMLInputElement;
const email = document.getElementById("email") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;
const name = document.getElementById("name") as HTMLInputElement;
const updatePassword = document.getElementById(
  "updatePassword"
) as HTMLButtonElement;
const updatePasswordForm = document.getElementById(
  "updatePasswordForm"
) as HTMLFormElement;
const updatePasswordBtn = document.getElementById(
  "updatePasswordBtn"
) as HTMLButtonElement;
export const textArea = document.getElementById(
  "textarea"
) as HTMLTextAreaElement;
export const form = document.getElementById("form") as HTMLFormElement;
export const loginError = document.getElementById(
  "loginError"
) as HTMLParagraphElement;
const forgotEmail = document.getElementById("forgotEmail") as HTMLInputElement;
const oldPassword = document.getElementById("oldPassword") as HTMLInputElement;
const newPassword = document.getElementById("newPassword") as HTMLInputElement;
export const showUsersUI = document.getElementById(
  "showUsersUI"
) as HTMLDivElement;

export const showAllUsersBtn = document.createElement("button");
let loginUiVisible = false;
let afterloginVisible = false;

// escape  key press
document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    afterLoginUI.style.display = "none";
    errorsDiv.style.display = "none";
    showUsersUI.style.display = "none";
    suggestions.style.display = "none";

    removeLogin();
  }
});

document.addEventListener("click", (event) => {
  const target = event.target as Node;
  if (loginUiVisible && !loginUi.contains(target) && target !== loginBtn) {
    loginUi.style.display = "none";
    loginUiVisible = false;
  }
  if (!updatePasswordForm.contains(target) && target !== updatePasswordBtn) {
    updatePasswordForm.style.display = "none";
  }
  if (afterloginVisible && !afterLogin.contains(target) && target !== logOut) {
    afterLoginUI.style.display = "none";
    afterloginVisible = false;
  }
  if (
    showUsersUI.style.display === "block" &&
    !showUsersUI.contains(target) &&
    target !== showAllUsersBtn
  ) {
    showUsersUI.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  updateHighlighting();
  resizeTextarea();
});

document.addEventListener("selectionchange", handleSelectionChange);

// text area input
textArea.addEventListener("input", () => {
  updateLineNumbers();
  saveFile(currentFileName, textArea.value);
  updateHighlighting();
  resizeTextarea();
  handleSelectionChange();
});

// auto complete
textArea.addEventListener("keydown", async (e) => {
  astAutoComplete(e);
  if (e.ctrlKey && e.key === "Enter") {
    e.preventDefault();
    await runCode();
  }
});

// highlight
textArea.addEventListener("scroll", function () {
  highlightedCode.scrollTop = textArea.scrollTop;
  highlightedCode.scrollLeft = textArea.scrollLeft;
});

// to run code
runBtn.addEventListener("click", async () => {
  await runCode();
});

const lightMode = document.getElementById("light");
const darkMode = document.getElementById("dark");

function applyTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("white");
  } else {
    document.body.classList.remove("white");
  }
}

// Apply theme on page load
applyTheme();

lightMode?.addEventListener("click", () => {
  document.body.classList.remove("white");
  localStorage.setItem("theme", "light");
});
darkMode?.addEventListener("click", () => {
  document.body.classList.add("white");
  localStorage.setItem("theme", "dark");
});

// log in signup ui
singnUpBtn?.addEventListener("click", () => {
  signupBtnFunctions();
});

loginBack.addEventListener("click", () => {
  loginBackFunction();
});

loginBtn.addEventListener("click", () => {
  loginUiVisible = !loginUiVisible;
  loginUi.style.display = loginUiVisible ? "block" : "none";
  resetFunction();
});

afterLogin.addEventListener("click", () => {
  afterloginVisible = !afterloginVisible;
  afterLoginUI.style.display = afterloginVisible ? "block" : "none";
  afterLoginShow();
});

// log out
logOut.addEventListener("click", () => {
  logOutFunction();
});

//update password

updatePasswordBtn.addEventListener("click", () => {
  updatePasswordForm.style.display = "flex";
});

// show all users

showAllUsersBtn.classList.add("showUserBtn");
showAllUsersBtn.textContent = "Show all users";

showAllUsersBtn.addEventListener("click", async () => {
  await showAllUsersFunction();
  showUsersUI.style.display = "block";
});

// login signup auth
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = {
    email: email.value,
    password: password.value,
  };
  try {
    await loginUser(user);
    form.reset();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      loginError.textContent = error.message;
    } else {
      console.error("Unexpected error:", error);
      loginError.textContent = "An unexpected error occurred.";
    }
  }
});

// signup user
signup.addEventListener("click", async (e) => {
  e.preventDefault();

  const newUser = {
    name: name.value,
    email: email.value,
    password: password.value,
  };

  try {
    await registerUser(newUser);
    form.reset();
  } catch (error) {
    console.error("Error during sign up:", error);
  }
});

// update password
updatePassword.addEventListener("click", async (e) => {
  e.preventDefault();

  const user = {
    email: forgotEmail.value,
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
  };
  try {
    await updatePasswordFunction(user);
    forgotEmail.value = "";
    oldPassword.value = "";
    newPassword.value = "";
    updatePasswordForm.style.display = "none";
    alert("Your password is updated");
  } catch (error) {
    console.error("Error during login:", error);
  }
});

// function call declaration
AfterLoginFunction();
addFileBtn.addEventListener("click", () => addFile());
updateLineNumbers();
initializeLocalStorage();
loadFile(defaultFileName);
