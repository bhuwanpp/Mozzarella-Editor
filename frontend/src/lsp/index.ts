import io from "socket.io-client";
import { resizeTextarea, updateHighlighting } from "../highlight";
import "../style.css";
const socket = io("http://localhost:8080");
const editor = document.getElementById("textarea") as HTMLTextAreaElement;
const suggestions = document.getElementById("suggestions") as HTMLDivElement;
let selectedIndex = -1;
let currentCompletions: any[] = [];

socket.on("connect", () => {
  console.log("Connected to server");
});

editor.addEventListener("input", () => {
  const cursorPosition = getCursorPosition(editor);
  const code = editor.value;

  updateHighlighting();
  resizeTextarea();

  if (code.length === 0) {
    suggestions.style.display = "none";
    return;
  }
  socket.emit("requestCompletion", code, cursorPosition);
});

socket.on("completion", (data) => {
  let entries;
  if (Array.isArray(data)) {
    entries = data;
  } else if (data && Array.isArray(data.entries)) {
    entries = data.entries;
  } else {
    console.error("Invalid completion data:", data);
    return;
  }
  showSuggestions(entries);
});

editor.addEventListener("keydown", (e) => {
  console.log("Key pressed: ", e.key);
  if (suggestions.style.display === "block") {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveSelection(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveSelection(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < currentCompletions.length) {
        applySuggestion(currentCompletions[selectedIndex].name);
      }
    }
  }
});

function getCursorPosition(textArea: any) {
  const lines = textArea.value.substr(0, textArea.selectionStart).split("\n");
  const line = lines.length;
  const offset = lines[lines.length - 1].length + 1;
  return { line, offset };
}

function showSuggestions(completions: any) {
  if (!Array.isArray(completions)) {
    console.error("Received invalid completion data:", completions);
    return;
  }
  const cursorPosition = editor.selectionStart;
  const code = editor.value.substring(0, cursorPosition);
  const lastWord = code.split(/\s|\./).pop() || "";

  currentCompletions = completions.filter((item: any) =>
    item.name.toLowerCase().startsWith(lastWord.toLowerCase())
  );

  suggestions.innerHTML = "";
  selectedIndex = -1;
  if (currentCompletions.length === 0 || lastWord.trim().length === 0) {
    suggestions.style.display = "none";
    return;
  }

  currentCompletions.forEach((item: any, index: any) => {
    const div = document.createElement("div");
    div.textContent = `${item.name} (${item.kind})`;
    div.dataset.index = index;
    div.onclick = () => {
      applySuggestion(item.name);
    };
    suggestions.appendChild(div);
  });
  positionSuggestions();
  suggestions.style.display = "block";
}

function positionSuggestions() {
  const rect = editor.getBoundingClientRect();
  const lineHeight = parseFloat(window.getComputedStyle(editor).lineHeight);
  const charWidth = 8;
  const offset = 45;

  const lines = editor.value.substr(0, editor.selectionStart).split("\n");
  const currentLineNumber = lines.length;
  const currentColumnNumber = lines[lines.length - 1].length;

  // Calculate the position based on scroll and cursor position
  const top =
    rect.top + (currentLineNumber - 1) * lineHeight - editor.scrollTop + offset;
  const left = rect.left + currentColumnNumber * charWidth - editor.scrollLeft;

  // Set the position of the suggestions box
  suggestions.style.left = `${left}px`;
  suggestions.style.top = `${top}px`;
}
function moveSelection(delta: any) {
  const items = suggestions.querySelectorAll("div");
  if (items.length === 0) return;

  selectedIndex = (selectedIndex + delta + items.length) % items.length;
  items.forEach((item, index) => {
    if (index === selectedIndex) {
      item.classList.add("selected");
      item.scrollIntoView({ block: "nearest" });
    } else {
      item.classList.remove("selected");
    }
  });
}

function applySuggestion(name: string) {
  const currentValue = editor.value;
  const cursorPosition = editor.selectionStart;
  const beforeCursor = currentValue.substring(0, cursorPosition);
  const afterCursor = currentValue.substring(cursorPosition);
  const lastDotIndex = beforeCursor.lastIndexOf(".");
  const lastWordStartIndex = beforeCursor.search(/\S+$/);

  let newValue;
  if (lastDotIndex > lastWordStartIndex) {
    newValue = beforeCursor.substring(0, lastDotIndex + 1) + name + afterCursor;
  } else {
    newValue =
      beforeCursor.substring(0, lastWordStartIndex) + name + afterCursor;
  }

  editor.value = newValue;
  const newCursorPosition = newValue.length - afterCursor.length;
  editor.setSelectionRange(newCursorPosition, newCursorPosition);
  editor.focus();
  suggestions.style.display = "none";

  // Update highlighting after applying suggestion
  updateHighlighting();
}

editor.addEventListener("input", positionSuggestions);
editor.addEventListener("scroll", positionSuggestions);
window.addEventListener("resize", positionSuggestions);
editor.addEventListener("scroll", () => {
  if (suggestions.style.display === "block") {
    positionSuggestions();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    suggestions.style.display = "none";
  }
});
