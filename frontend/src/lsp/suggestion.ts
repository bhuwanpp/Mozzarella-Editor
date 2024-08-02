import { editor, suggestions } from ".";
import { updateHighlighting } from "../highlight";
import "../style.css";
import { errorsDiv } from "./errors";
export let selectedIndex = -1;
export let currentCompletions: any[] = [];
export function showSuggestions(completions: any) {
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

export function positionSuggestions() {
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

export function moveSelection(delta: any) {
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

export function applySuggestion(name: string) {
  console.log("it comes here suu");
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
  console.log(newValue);
  const newCursorPosition = newValue.length - afterCursor.length;
  editor.setSelectionRange(newCursorPosition, newCursorPosition);
  editor.focus();
  // Hide suggestions
  suggestions.style.display = "none";
  currentCompletions = [];

  // Update highlighting after applying suggestion
  updateHighlighting();

  // clear error after apply changes
  clearErrors();
}

export function clearErrors() {
  errorsDiv.style.display = "none";
  errorsDiv.innerHTML = "";
}
