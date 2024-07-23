import "./style.css";
const addFile = document.getElementById("add-file");
const textArea = document.getElementById("textarea") as HTMLTextAreaElement;
const output = document.getElementById("output") as HTMLParagraphElement;
const runBtn = document.getElementById("run");
const lineNumbers = document.getElementById("line-numbers") as HTMLDivElement;

textArea.value = `// Your JavaScript code here \nconsole.log("Hello, Mozzarella!")`;

textArea.addEventListener("input", () => {
  updateNumber();
});

function updateNumber() {
  const lines = textArea.value.split("\n").length!;
  // lineNumbers.textContent = String(lines);
  let lineNumberText = "";
  for (let i = 1; i <= lines; i++) {
    lineNumberText += i + "\n";
  }
  lineNumbers.textContent = lineNumberText;
}

runBtn?.addEventListener("click", () => {
  runCode();
});

updateNumber();

function runCode() {
  const code = textArea.value!;

  output.textContent = "";
  if (code.length === 0) {
    output.textContent = "write something first";
  }
  // create new iframe
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const iframeWindow = iframe.contentWindow as Window & { console: Console };
  const consoleMethod: Array<"log" | "error" | "warn" | "info"> = [
    "log",
    "error",
    "warn",
    "info",
  ];
  consoleMethod.forEach((method) => {
    iframeWindow.console[method] = (...args: any[]) => {
      output.textContent += args.join(" ") + "\n";
    };
  });

  //handle error
  iframeWindow.onerror = (message, source, lineno, colno, error) => {
    output.textContent += ` Error ${message} (line${lineno}, column ${colno})\n`;
    return true;
  };
  // execute the code

  try {
    const script = iframeWindow.document.createElement("script");
    script.textContent = code;
    iframeWindow.document.body.appendChild(script);
  } catch (e) {
    if (e instanceof Error) {
      output.textContent += `Error ${e.message}\n`;
    } else {
      output.textContent += `An unknown error occured\n`;
    }
  }
  //clean up
  document.body.removeChild(iframe);
}
