import { textArea } from "../main";

const output = document.getElementById("output") as HTMLParagraphElement;

export const runCode = async () => {
  const code = textArea.value;
  output.textContent = "";

  if (code.length === 0) {
    output.textContent = "Write something first";
    return;
  }

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
