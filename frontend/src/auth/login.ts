import axios from "axios";
import Prism from "prismjs";
import {
  fetchFilesFromBackend,
  getAccessToken,
} from "../editor/fileOperations";
import { INewUser, IupdateUser, User } from "../interface/user";
import { afterLoginUI, showAllUsersBtn } from "../main";
import { AfterLoginFunction, loginBackFunction, removeLogin } from "./authUi";

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
  } catch (error) {
    console.error("Error updating password:", error);
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

export async function showAllUsersFunction() {
  const accessToken = getAccessToken();
  try {
    const response = await axios.get("http://localhost:3000/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const users = response.data.data;
    updateUserUI(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

async function updateUserUI(users: any[]) {
  const showUsersUI = document.getElementById("showUsersUI");

  if (showUsersUI) {
    showUsersUI.innerHTML = `
  <p>All Users</p>
      <ul>
        ${users
          .map(
            (user) => `
          <li class="ulUsers" data-user-id="${user.userId}">User ID: ${user.userId}, Name: ${user.name}, Email: ${user.email}
          <span class="delete-btn" data-user-id="${user.userId}">Delete</span>
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    // Add event listeners to each list item
    const userItems = showUsersUI.querySelectorAll(".ulUsers");
    userItems.forEach((item) => {
      item.addEventListener("click", async () => {
        const userId = (item as HTMLLIElement).getAttribute("data-user-id");
        if (userId) {
          try {
            const userFile = await fetchUserFile(userId);
            displayUserFile(userFile);
          } catch (error) {
            console.error("Error fetching user file:", error);
          }
        }
      });
    });
    // Add event listeners to delete buttons
    const deleteButtons = showUsersUI.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const userId = button.getAttribute("data-user-id");
        if (userId) {
          if (userId === "2") {
            alert("You cannot delete your own account.");
            return;
          }
          // Show confirmation dialog
          const isConfirmed = window.confirm(
            "Are you sure you want to delete this user?"
          );

          if (isConfirmed) {
            try {
              await deleteUser(userId);
              showAllUsersFunction();
            } catch (error) {
              console.error("Error deleting user file:", error);
            }
          }
        }
      });
    });
  }
}

async function fetchUserFile(userId: string) {
  const accessToken = getAccessToken();
  try {
    const response = await axios.get(`http://localhost:3000/files/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user file:", error);
    throw error;
  }
}
function escapeHtml(unsafe: any) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function displayUserFile(userFile: any) {
  const showUsersUI = document.getElementById("showUsersUI");

  if (showUsersUI) {
    const fileContents = userFile.data
      .map(
        (file: any) =>
          `<div>
        <h3 class = "pt-1"> file-name: ${file.fileName}</h3>
        <pre><code class="language-js pt-1"> file-code: ${escapeHtml(
          file.fileData
        )}</code></pre>
      </div>`
      )
      .join("");
    if (fileContents) {
      showUsersUI.innerHTML = `
        <p>User File Content:</p>
        ${fileContents}
        `;
    } else {
      showUsersUI.innerHTML = `<p>User File Content:</p><p>Users have no files </p>`;
    }

    Prism.highlightAll();
  }
}
async function deleteUser(userId: string) {
  const accessToken = getAccessToken();
  try {
    await axios.delete(`http://localhost:3000/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`User  with ID ${userId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
}
// Initialize the SPA
document.addEventListener("DOMContentLoaded", () => {
  showAllUsersFunction();
});
