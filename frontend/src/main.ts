import { updateHighlighting } from "./highlight";
import "./style.css";

const addFileBtn = document.getElementById("add-file") as HTMLButtonElement;
export const textArea = document.getElementById(
  "textarea"
) as HTMLTextAreaElement;
const lineNumbers = document.getElementById("line-numbers") as HTMLDivElement;
const filesWrapper = document.getElementById("files") as HTMLDivElement;

const defaultFileName = "index.js";
const defaultFileData =
  '// Your JavaScript code here \nconsole.log("Hello, Mozzarella!")';
let currentFileName = defaultFileName;
let fileCounter = 1;

// if not login
// localStorage.clear();
localStorage.setItem(defaultFileName, defaultFileData);

const loadFilesFromStorage = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const fileName = localStorage.key(i);
    if (fileName && fileName.endsWith(".js")) {
      createFileButton(fileName);
    }
  }
};

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
    loadFile(fileNameText.textContent);
    updateHighlighting();
  });

  filesWrapper.insertBefore(fileBtn, addFileBtn);
};

const loadFile = (fileName: string | null) => {
  if (fileName) {
    const fileData = localStorage.getItem(fileName);
    if (fileData) {
      textArea.value = fileData;
      updateLineNumbers();
      currentFileName = fileName;
    }
  }
  textArea.style.display = "block";
  lineNumbers.style.display = "block";
};

const saveFile = (fileName: string, fileData: string) => {
  localStorage.setItem(fileName, fileData);
};

const updateLineNumbers = () => {
  const lines = textArea.value.split("\n").length;
  let lineNumberText = "";
  for (let i = 1; i <= lines; i++) {
    lineNumberText += `${i}\n`;
  }
  lineNumbers.textContent = lineNumberText;
};

const addFile = () => {
  const fileName = `script${fileCounter}.js`;
  const fileData = '// Your JavaScript code here \nconsole.log("new file")';

  saveFile(fileName, fileData);
  createFileButton(fileName);
  fileCounter++;
  loadFile(fileName);
};

const createRenameButton = (fileNameText: HTMLSpanElement) => {
  const renameButton = document.createElement("button");
  renameButton.className = "rename-button";
  renameButton.innerHTML =
    '<iconify-icon icon="solar:pen-bold"></iconify-icon>';
  renameButton.addEventListener("click", () => {
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
        const fileData = localStorage.getItem(oldFileName);
        localStorage.removeItem(oldFileName);
        fileNameText.textContent = newFileName;
        saveFile(newFileName, fileData || "");
        currentFileName = newFileName;
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
  deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this file?")) {
      const fileName = (file.querySelector(".file-name") as HTMLSpanElement)
        .textContent!;
      file.remove();
      localStorage.removeItem(fileName);

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

textArea.addEventListener("input", () => {
  updateLineNumbers();
  saveFile(currentFileName, textArea.value);
});

addFileBtn.addEventListener("click", addFile);

loadFilesFromStorage();
loadFile(defaultFileName);
updateLineNumbers();

const lightMode = document.getElementById("light");
lightMode?.addEventListener("click", () => {
  document.body.classList.remove("white");
});
const darkMode = document.getElementById("dark");
darkMode?.addEventListener("click", () => {
  document.body.classList.add("white");
});
