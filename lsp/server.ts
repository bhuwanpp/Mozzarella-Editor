// server.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { spawn } from 'child_process';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  const tsServer = spawn('tsserver', ['--stdio']);
  let buffer = '';

  // Get data from ts server
  // Listen for data on the stdout stream of the subprocess
  tsServer.stdout.on('data', (data) => {
    // Data -> buffer object which represents binary data
    buffer += data.toString();
    let newlineIndex;

    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
      const message = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);

      console.log('message', message)
      if (message.startsWith('{')) {
        try {
          const response = JSON.parse(message);
          if (response.type === 'response' && response.body) {
            socket.emit('completion', response.body);
          }
        } catch (error) {
          console.error('Error parsing TS server response:', error);
        }
      }
    }
  });

  tsServer.stderr.on('data', (data) => {
    console.error(`TypeScript Server Error: ${data}`);
  });

  // Send data to ts server
  socket.on('requestCompletion', (code: string) => {
    console.log('Received completion request for:', code);
    const lastWord = code.split(/\s/).pop() || '';

    const openRequest = {
      seq: 0,
      type: "request",
      command: "open",
      arguments: {
        file: "/virtual.ts",
        fileContent: code,
        scriptKindName: "JS"
      }
    };
    tsServer.stdin.write(JSON.stringify(openRequest) + '\n');

    const completionRequest = {
      seq: 1,
      type: "request",
      command: "completions",
      arguments: {
        file: "/virtual.ts",
        line: 1,
        offset: code.length + 1,
        prefix: lastWord,
      }
    };
    tsServer.stdin.write(JSON.stringify(completionRequest) + '\n');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    tsServer.kill();
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

