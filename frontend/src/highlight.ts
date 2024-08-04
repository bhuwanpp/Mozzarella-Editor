import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import "./style.css";

const textarea = document.getElementById("textarea") as HTMLTextAreaElement;
export const highlightedCode = document.getElementById(
  "highlighted-code"
) as HTMLPreElement;
const highlightDiv = document.getElementById("highlight") as HTMLDivElement;
export function updateHighlighting() {
  let code = textarea.value;
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
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

export const handleSelectionChange = () => {
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
