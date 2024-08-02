import axios from "axios";
import { updateHighlighting } from "../highlight";
import { addFileBtn, textArea } from "../main";
import { lineNumbers, updateLineNumbers } from "./lineNumbers";
const filesWrapper = document.getElementById("files") as HTMLDivElement;
const whiteLine = document.getElementById("whiteLine") as HTMLParagraphElement;

export const defaultFileName = "index.js";
const defaultFileData =
  '// Your JavaScript code here \nconsole.log("Hello, Mozzarella!")';
export let currentFileName = defaultFileName;
let fileCounter = 1;

export const getAccessToken = (): string | null => {
  const userCredentials = localStorage.getItem("userCredentials");
  if (userCredentials) {
    const [accessToken] = JSON.parse(userCredentials);
    return accessToken || null;
  }
  return null;
};

export const initializeLocalStorage = async () => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    clearJsFilesFromLocalStorage();
    localStorage.setItem(defaultFileName, defaultFileData);
    loadFile(defaultFileName);
    whiteLine.style.display = "block";
  } else {
    await fetchFilesFromBackend();
  }

  loadFilesFromStorage();
};

export const clearJsFilesFromLocalStorage = () => {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.endsWith(".js")) {
      localStorage.removeItem(key);
    }
  }
};

export const loadFilesFromStorage = () => {
  const fileButtons = filesWrapper.querySelectorAll(".file-button");
  fileButtons.forEach((button) => button.remove());
  for (let i = 0; i < localStorage.length; i++) {
    const fileName = localStorage.key(i);
    if (fileName && fileName.endsWith(".js")) {
      createFileButton(fileName);
    }
  }
};
// todo if i rename with long file it append after file
const createFileButton = (fileName: string) => {
  const fileBtn = document.createElement("button");
  fileBtn.className = "file-button";

  const fileNameText = document.createElement("span");
  fileNameText.className = "file-name";
  fileNameText.textContent = fileName;

  const buttonWrapper = document.createElement("span");
  buttonWrapper.className = "button-wrapper";
  buttonWrapper.style.display = "flex";

  const renameButton = createRenameButton(fileNameText);
  const deleteButton = createDeleteButton(fileBtn);

  buttonWrapper.appendChild(renameButton);
  buttonWrapper.appendChild(deleteButton);

  fileBtn.appendChild(fileNameText);
  fileBtn.appendChild(buttonWrapper);

  fileBtn.addEventListener("click", () => {
    const rect = fileBtn.getBoundingClientRect();
    const buttonWrapperRect = buttonWrapper.getBoundingClientRect();
    const fileNameRect = fileNameText.getBoundingClientRect();
    const renameWidth = `${buttonWrapperRect.width + fileNameRect.width}px`;
    whiteLine.style.width = renameWidth;
    whiteLine.style.top = `${rect.bottom - 86}px`;
    whiteLine.style.left = `${fileNameRect.left - 40}px`;
    loadFile(fileNameText.textContent);
    updateHighlighting();
  });

  filesWrapper.appendChild(fileBtn);
  filesWrapper.insertBefore(fileBtn, addFileBtn);
  // filesWrapper.style.background = "black";
};

export const loadFile = (fileName: string | null) => {
  if (fileName) {
    const fileData = localStorage.getItem(fileName);
    if (fileData) {
      textArea.value = fileData;
      updateLineNumbers();
      currentFileName = fileName;
    } else {
      textArea.value = "";
      updateLineNumbers();
      currentFileName = fileName;
    }
  }
  textArea.style.display = "block";
  lineNumbers.style.display = "block";
};

export const saveFile = async (fileName: string, fileData: string) => {
  localStorage.setItem(fileName, fileData);
  const accessToken = getAccessToken();
  if (accessToken) {
    try {
      await axios.post(
        "http://localhost:3000/files",
        {
          fileName,
          fileData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error saving file to backend:", error);
    }
  }
};

export const fetchFilesFromBackend = async () => {
  const accessToken = getAccessToken();
  if (accessToken) {
    try {
      const response = await axios.get("http://localhost:3000/files", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.endsWith(".js")) {
          localStorage.removeItem(key);
        }
      }
      // Check if response.data.data exists and is an array
      if (response.data && Array.isArray(response.data.data)) {
        response.data.data.forEach(
          (file: { fileName: string; fileData: string }) => {
            localStorage.setItem(file.fileName, file.fileData);
          }
        );
      } else {
        console.error("Unexpected response structure:", response.data);
      }

      loadFilesFromStorage();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log("Token might be expired, attempting to refresh...");
      }
    }
  } else {
    loadFilesFromStorage();
  }
};

export const addFile = async () => {
  const fileName = `script${fileCounter}.js`;
  const fileData = '// Your JavaScript code here \nconsole.log("new file")';
  await saveFile(fileName, fileData);
  createFileButton(fileName);
  fileCounter++;
  loadFile(fileName);
};

const createRenameButton = (fileNameText: HTMLSpanElement) => {
  const renameButton = document.createElement("button");
  renameButton.className = "rename-button";
  renameButton.innerHTML =
    '<iconify-icon icon="solar:pen-bold"></iconify-icon>';
  renameButton.addEventListener("click", async () => {
    let newFileName = prompt(
      "Enter a new filename",
      fileNameText.textContent || ""
    );
    if (newFileName) {
      if (!newFileName.endsWith(".js")) {
        newFileName += ".js";
      }

      if (newFileName !== fileNameText.textContent) {
        const oldFileName = fileNameText.textContent!;
        const accessToken = getAccessToken();

        try {
          if (accessToken) {
            await axios.put(
              `http://localhost:3000/files/rename`,
              { oldFileName, newFileName },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
          }
          const fileData = localStorage.getItem(oldFileName);
          localStorage.removeItem(oldFileName);
          fileNameText.textContent = newFileName;
          localStorage.setItem(newFileName, fileData || "");
          currentFileName = newFileName;
        } catch (error) {
          console.error("Error renaming file:", error);
          alert("Failed to rename file. Please try again.");
        }
      }
    }
  });
  return renameButton;
};

const createDeleteButton = (file: HTMLButtonElement) => {
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerHTML =
    '<iconify-icon icon="material-symbols:close"></iconify-icon>';
  deleteButton.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete this file?")) {
      const fileName = (file.querySelector(".file-name") as HTMLSpanElement)
        .textContent!;
      file.remove();
      localStorage.removeItem(fileName);
      const accessToken = getAccessToken();
      if (accessToken) {
        try {
          await axios.delete(`http://localhost:3000/files/${fileName}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        } catch (error) {
          console.error("Error deleting file from backend:", error);
        }
      }

      updateCurrentFileAfterDeletion(fileName);
    }
  });
  return deleteButton;
};

const updateCurrentFileAfterDeletion = (deletedFileName: string) => {
  if (deletedFileName === currentFileName) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith(".js")) {
        keys.push(key);
      }
    }

    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      if (lastKey) {
        loadFile(lastKey);
      }
    } else {
      textArea.value = "";
      textArea.style.display = "none";
      lineNumbers.style.display = "none";
      currentFileName = "";
      updateLineNumbers();
    }
  }
};
