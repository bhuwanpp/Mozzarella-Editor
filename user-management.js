async function showAllUsersFunction() {
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

function updateUserUI(users: any[]) {
    const userList = document.getElementById("userList");

    if (userList) {
        userList.innerHTML = `
            <h2>All Users</h2>
            <ul>
                ${users
                    .map(
                        (user) => `
                    <li class="user-item" data-user-id="${user.userId}">
                        User ID: ${user.userId}, Name: ${user.name}, Email: ${user.email}
                        <span class="delete-btn" data-user-id="${user.userId}">Delete</span>
                    </li>
                `
                    )
                    .join("")}
            </ul>
        `;

        // Add event listeners to each list item
        const userItems = userList.querySelectorAll(".user-item");
        userItems.forEach((item) => {
            item.addEventListener("click", async (event) => {
                if (!(event.target as HTMLElement).classList.contains('delete-btn')) {
                    const userId = item.getAttribute("data-user-id");
                    if (userId) {
                        try {
                            const userFile = await fetchUserFile(userId);
                            displayUserFile(userFile);
                        } catch (error) {
                            console.error("Error fetching user file:", error);
                        }
                    }
                }
            });
        });

        // Add event listeners to delete buttons
        const deleteButtons = userList.querySelectorAll(".delete-btn");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", async (event) => {
                event.stopPropagation();
                const userId = button.getAttribute("data-user-id");
                if (userId) {
                    try {
                        await deleteUserFile(userId);
                        showAllUsersFunction(); // Refresh the user list
                    } catch (error) {
                        console.error("Error deleting user file:", error);
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

function displayUserFile(userFile: any) {
    const userDetails = document.getElementById("userDetails");

    if (userDetails) {
        userDetails.innerHTML = `
            <h2>User File Content:</h2>
            <pre>${JSON.stringify(userFile, null, 2)}</pre>
        `;
    }
}

async function deleteUserFile(userId: string) {
    const accessToken = getAccessToken();
    try {
        await axios.delete(`http://localhost:3000/files/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(`User file with ID ${userId} deleted successfully`);
    } catch (error) {
        console.error("Error deleting user file:", error);
        throw error;
    }
}

// Initialize the SPA
document.addEventListener("DOMContentLoaded", () => {
    showAllUsersFunction();
});

// You need to implement this function to get the access token
function getAccessToken() {
    // Implement your logic to retrieve the access token
    return "your_access_token_here";
}