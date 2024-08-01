import { textArea } from "../main";

import io from "socket.io-client";

const socket = io("http://localhost:8080", { transports: ["websocket"] });
export const errorsDiv = document.getElementById("errors") as HTMLDivElement;

socket.on("connect", () => {
  console.log("Connected to server");
});

textArea.addEventListener("input", () => {
  const code = textArea.value;
  socket.emit("codeUpdate", code);
});

socket.on("diagnostics", (diagnostics) => {
  showErrors(diagnostics);
});

function showErrors(diagnostics: any) {
  if (Object.keys(diagnostics).length >= 1) {
    errorsDiv.style.display = "block";
  } else {
    errorsDiv.style.display = "none";
  }
  errorsDiv.innerHTML = "";
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "x";
  closeBtn.classList.add("closeBtn");
  errorsDiv.appendChild(closeBtn);
  closeBtn.addEventListener("click", () => {
    errorsDiv.style.display = "none";
  });

  diagnostics.forEach((error: any) => {
    const errorDiv = document.createElement("div");
    errorDiv.textContent = `Error (${error.code}): ${error.text} at line ${error.start.line}, column ${error.start.offset}`;
    errorsDiv.appendChild(errorDiv);
  });
}
