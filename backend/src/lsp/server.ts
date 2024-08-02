// server.ts
import { spawn } from "child_process";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  const tsServer = spawn("tsserver", ["--stdio"]);
  let buffer = "";
  let seq = 0;

  tsServer.stdout.on("data", (data) => {
    buffer += data.toString();
    let newlineIndex;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      const message = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);

      if (message.startsWith("{")) {
        try {
          const response = JSON.parse(message);
          if (response.type === "response") {
            if (response.command === "completions" && response.body) {
              socket.emit("completion", response.body);
            } else if (response.command === "semanticDiagnosticsSync") {
              socket.emit("diagnostics", response.body);
              console.log("emitting diagnostics", response.body);
            }
          }
        } catch (error) {
          console.error("Error parsing TS server response:", error);
        }
      }
    }
  });

  tsServer.stderr.on("data", (data) => {
    console.error(`TypeScript Server Error: ${data}`);
  });

  socket.on("codeUpdate", (code: string) => {
    console.log("Received code update:", code);
    sendOpenRequest(tsServer, code);
    sendCompletionRequest(tsServer, code);
    sendDiagnosticsRequest(tsServer);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    tsServer.kill();
  });

  function sendOpenRequest(tsServer: any, code: string) {
    const openRequest = {
      seq: seq++,
      type: "request",
      command: "open",
      arguments: {
        file: "/virtual.ts",
        fileContent: code,
        scriptKindName: "TS",
      },
    };
    tsServer.stdin.write(JSON.stringify(openRequest) + "\n");
  }

  function sendCompletionRequest(tsServer: any, code: string) {
    const completionRequest = {
      seq: seq++,
      type: "request",
      command: "completions",
      arguments: {
        file: "/virtual.ts",
        line: 1,
        offset: code.length + 1,
        prefix: code.split(/\s/).pop() || "",
      },
    };
    tsServer.stdin.write(JSON.stringify(completionRequest) + "\n");
  }

  function sendDiagnosticsRequest(tsServer: any) {
    const diagnosticsRequest = {
      seq: seq++,
      type: "request",
      command: "semanticDiagnosticsSync",
      arguments: { file: "/virtual.ts" },
    };
    tsServer.stdin.write(JSON.stringify(diagnosticsRequest) + "\n");
  }
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(` lsp Server running on port ${PORT}`);
});
