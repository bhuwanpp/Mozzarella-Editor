import { spawn } from "child_process";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("a user is connected");
  const tsServer = spawn("tsserver", ["--stdio"]);
  let buffer = "";
  // get data from ts server
  // Listen for data on the stdout stream of the subprocess
  tsServer.stdout.on("data", (data) => {
    console.log("Raw tsServer output:", data.toString());

    //data -> buffer object   which represents binary data
    buffer += data.toString();
    let newLineIndex;

    while ((newLineIndex = buffer.indexOf("\n")) !== -1) {
      const message = buffer.slice(0, newLineIndex);
      buffer = buffer.slice(newLineIndex + 1);
      console.log("message", message);

      if (message.startsWith("{")) {
        try {
          const response = JSON.parse(message);
          console.log("response", response.body);
          if (response.type === "response" && response.body) {
            console.log(
              "Emitting completion with response body:",
              response.body
            );
            socket.emit("completion", response.body);
          }
        } catch (error) {
          console.error("Error parsing TS server response", error);
        }
      }
    }
  });
  tsServer.stderr.on("data", (data) => {
    console.error(`TypeScript Server Error: ${data}`);
  });
  // send data to ts server
  socket.on("requestCompletion", (code) => {
    console.log("Received requestCompletion with code:", code);
    const lastWord = code.split(/\s/).pop() || "";
    const openRequest = {
      seq: 0,
      type: "request",
      command: "open",
      arguments: {
        file: "/virtual.ts",
        fileContent: code,
        scriptKindName: "TS",
      },
    };
    tsServer.stdin.write(JSON.stringify(openRequest + "\n"));
    const completionRequest = {
      seq: 1,
      type: "request",
      command: "completions",
      arguments: {
        file: "/virtual.ts",
        line: 1,
        offset: code.length + 1,
        prefix: lastWord,
      },
    };
    tsServer.stdin.write(JSON.stringify(completionRequest + "\n"));
    console.log("Sent completion request to tsServer:", completionRequest);
  });
  socket.on("disconnect", () => {
    console.log("User disconnect");
    tsServer.kill();
  });
});
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
