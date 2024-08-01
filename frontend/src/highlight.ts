import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import "./style.css";

const textarea = document.getElementById("textarea") as HTMLTextAreaElement;
const highlightedCode = document.getElementById(
  "highlighted-code"
) as HTMLPreElement;

export function updateHighlighting() {
  const code = textarea.value;
  const highlightedHTML = Prism.highlight(
    code,
    Prism.languages.javascript,
    "javascript"
  );
  highlightedCode.innerHTML = highlightedHTML + "\n";
  highlightedCode.scrollTop = textarea.scrollTop;
  highlightedCode.scrollLeft = textarea.scrollLeft;
}

export function resizeTextarea() {
  textarea.style.height = textarea.scrollHeight + "px";
}

textarea.addEventListener("input", () => {
  updateHighlighting();
  resizeTextarea();
});

textarea.addEventListener("scroll", function () {
  highlightedCode.scrollTop = textarea.scrollTop;
  highlightedCode.scrollLeft = textarea.scrollLeft;
});

document.addEventListener("DOMContentLoaded", function () {
  updateHighlighting();
});

const highlightDiv = document.getElementById("highlight") as HTMLDivElement;
const handleSelectionChange = () => {
  if (document.activeElement === textarea) {
    const start = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, start);
    const linesBefore = textBefore.split("\n");
    const currentLineNumber = linesBefore.length;

    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
    const lineTop = (currentLineNumber - 1) * lineHeight;

    highlightDiv.style.top = `${lineTop}px`;
    highlightDiv.style.height = `${lineHeight}px`;
  }
};

document.addEventListener("selectionchange", handleSelectionChange);
textarea.addEventListener("input", handleSelectionChange);
