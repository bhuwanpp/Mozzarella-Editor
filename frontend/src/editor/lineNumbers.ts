import { textArea } from "../main";
export const lineNumbers = document.getElementById(
  "line-numbers"
) as HTMLDivElement;

export const updateLineNumbers = () => {
  const lines = textArea.value.split("\n").length;
  let lineNumberText = "";
  for (let i = 1; i <= lines; i++) {
    lineNumberText += `${i}\n`;
  }
  lineNumbers.textContent = lineNumberText;
};
