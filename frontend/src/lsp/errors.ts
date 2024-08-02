export const errorsDiv = document.getElementById("errors") as HTMLDivElement;

export function showErrors(diagnostics: any) {
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
