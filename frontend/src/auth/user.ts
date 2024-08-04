import axios from "axios";
import Prism from "prismjs";
import { getAccessToken } from "../editor/fileOperations";
import { IUserFile, IUserId } from "../interface/user";

let currentPage = 1;
const usersPerPage = 10;
// show all user function
export async function showAllUsersFunction(page = 1) {
  const accessToken = getAccessToken();
  try {
    const response = await axios.get(
      `http://localhost:3000/users?page=${page}&limit=${usersPerPage}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const { data: users, meta } = response.data;
    console.log(meta);
    updateUserUI(users, meta);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// update  users
async function updateUserUI(
  users: IUserId[],
  meta: { page: number; size: number; total: number; totalPages: number }
) {
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
              <div class="pagination pt-10">
        ${
          meta.page > 1
            ? `<button id="prevPage" class="bg-blue-400 px-2 py-1 rounded-md">Previous</button>`
            : ""
        }
        <span>Page ${meta.page} of ${meta.totalPages}</span>
        ${
          meta.page < meta.totalPages
            ? `<button id="nextPage" class="bg-blue-400 px-2 py-1 rounded-md">Next</button>`
            : ""
        }
      </div>
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
      button.addEventListener("click", async (event) => {
        const userId = button.getAttribute("data-user-id");
        event.stopPropagation();
        if (userId) {
          const isConfirmed = window.confirm(
            "Are you sure you want to delete this user?"
          );

          if (isConfirmed) {
            try {
              await deleteUser(userId);
              console.log("it comes here admin delete ");
              showAllUsersFunction(currentPage);
            } catch (error) {
              alert("you cannot delete to self or admin");
              console.error("Error deleting user file:", error);
            }
          }
        }
      });
    });
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          showAllUsersFunction(currentPage);
        }
      });
    }
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (currentPage < meta.totalPages) {
          currentPage++;
          showAllUsersFunction(currentPage);
        }
      });
    }
  }
}

// fetch user file
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

// escape html
function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// display user file
function displayUserFile(userFile: IUserFile) {
  const showUsersUI = document.getElementById("showUsersUI");

  if (showUsersUI) {
    const fileContents = userFile.data
      .map(
        (file) =>
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

// delete user
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
    throw error;
  }
}
