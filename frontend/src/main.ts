import "./style.css";

// Element references
const addFileBtn = document.getElementById("add-file") as HTMLButtonElement;
const textArea = document.getElementById("textarea") as HTMLTextAreaElement;
const output = document.getElementById("output") as HTMLParagraphElement;
const runBtn = document.getElementById("run") as HTMLButtonElement;
const lineNumbers = document.getElementById("line-numbers") as HTMLDivElement;
const filesWrapper = document.getElementById("files") as HTMLDivElement;

// Default file setup
const defaultFileName = "index.js";
const defaultFileData =
  '// Your JavaScript code here \nconsole.log("Hello, Mozzarella!")';
let currentFileName = defaultFileName;
let fileCounter = 1; // For generating new file names

// Ensure a default file is set in local storage
localStorage.clear();
localStorage.setItem(defaultFileName, defaultFileData);

// Load files from local storage on page load
const loadFilesFromStorage = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const fileName = localStorage.key(i);
    if (fileName) {
      createFileButton(fileName);
    }
  }
};

// Create file button element
const createFileButton = (fileName: string) => {
  const fileBtn = document.createElement("button");
  fileBtn.textContent = fileName;
  fileBtn.className = "file-button";
  fileBtn.addEventListener("click", () => {
    loadFile(fileName);
  });

  const renameButton = createRenameButton(fileBtn);
  const deleteButton = createDeleteButton(fileBtn);

  fileBtn.appendChild(renameButton);
  fileBtn.appendChild(deleteButton);

  filesWrapper.insertBefore(fileBtn, addFileBtn);
};

// Load file content into the text area
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

// Save file content to local storage
const saveFile = (fileName: string, fileData: string) => {
  localStorage.setItem(fileName, fileData);
};

// Update line numbers in the editor
const updateLineNumbers = () => {
  const lines = textArea.value.split("\n").length;
  let lineNumberText = "";
  for (let i = 1; i <= lines; i++) {
    lineNumberText += `${i}\n`;
  }
  lineNumbers.textContent = lineNumberText;
};

// Run code in a sandboxed iframe
const runCode = () => {
  const code = textArea.value;
  output.textContent = "";

  if (code.length === 0) {
    output.textContent = "Write something first";
    return;
  }

  // Create new iframe for code execution
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const iframeWindow = iframe.contentWindow as Window & { console: Console };
  const consoleMethods: Array<"log" | "error" | "warn" | "info"> = [
    "log",
    "error",
    "warn",
    "info",
  ];

  consoleMethods.forEach((method) => {
    iframeWindow.console[method] = (...args: any[]) => {
      output.textContent += args.join(" ") + "\n";
    };
  });

  iframeWindow.onerror = (message, source, lineno, colno, error) => {
    output.textContent += `Error: ${message} (line ${lineno}, column ${colno})\n`;
    return true;
  };

  try {
    const script = iframeWindow.document.createElement("script");
    script.textContent = code;
    iframeWindow.document.body.appendChild(script);
  } catch (e) {
    output.textContent += `Error: ${
      e instanceof Error ? e.message : "An unknown error occurred"
    }\n`;
  } finally {
    document.body.removeChild(iframe);
  }
};

// Add a new file
const addFile = () => {
  const fileName = `script${fileCounter}.js`;
  const fileData = '// Your JavaScript code here \nconsole.log("new file")';

  saveFile(fileName, fileData);
  createFileButton(fileName);
  fileCounter++;
  loadFile(fileName);
};

// Create rename button
const createRenameButton = (file: HTMLButtonElement) => {
  const renameButton = document.createElement("button");
  renameButton.className = "rename-button";
  renameButton.innerHTML =
    '<iconify-icon icon="solar:pen-bold"></iconify-icon>';
  renameButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const newFileName = prompt("Enter a new filename", file.textContent || "");
    if (newFileName && newFileName !== file.textContent) {
      const oldFileName = file.textContent!;
      const fileData = localStorage.getItem(oldFileName);
      localStorage.removeItem(oldFileName);
      file.textContent = newFileName;
      saveFile(newFileName, fileData || "");
      currentFileName = newFileName;
    }
  });
  return renameButton;
};

// Create delete button
const createDeleteButton = (file: HTMLButtonElement) => {
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerHTML =
    '<iconify-icon icon="material-symbols:close"></iconify-icon>';
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this file?")) {
      const fileName = file.textContent!;
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

// Event listeners
textArea.addEventListener("input", () => {
  updateLineNumbers();
  saveFile(currentFileName, textArea.value);
});

runBtn.addEventListener("click", runCode);
addFileBtn.addEventListener("click", addFile);

// Initialize the editor with files from local storage
loadFilesFromStorage();
loadFile(defaultFileName);
updateLineNumbers();
