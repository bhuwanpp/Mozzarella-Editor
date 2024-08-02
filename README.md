# Mozzarella Editor

### Description

Mozzarella JS aims to provide an advanced online JavaScript code editor and compiler similar to online js compiler. It will enable users to write, compile, and execute JavaScript code directly within their web browsers.

### Motivation

- Develop a custom online JavaScript code editor to run code.
- Provide a platform for testing and learning JavaScript features interactively.

### Features

- Code Execution: Run JavaScript code and view the output.
- Code Editor: Write and edit JavaScript code with real-time syntax highlighting and error reporting.
- LSP Integration: Auto-completion and error diagnostics using Language Server Protocol.
- File Management: Create, save, and load files; handle file operations and storage.
- User Authentication: Sign up, log in, and manage user sessions.
- Password Management: Update user passwords securely.
- Theming: Toggle between light and dark modes.

### Technologies Used

1. Frontend:

   - HTML
   - Tailwind CSS
   - TypeScript
   - Iconify (for icons)

2. Backend:
   - Node.js
   - Express.js
   - PostgreSQL (database)
   - kenx(Query Builder)
   - Docker (for code execution)
   - Socket.io (real time lsp)
   - TypeScript Language Server (for auto-completion and error diagnostics)

Quick Start

1.  With Git Clone

    - Clone the project:\
      `git clone git@github.com:bhuwanpp/Mozzarella-Editor.git`
    - Navigate to the project directory:\
      `cd Mozzarella-Editor`
    - Set up and start the backend:\
       `cd backend`\
      `npm install`\
      `npm start`
    - Set up and start the frontend:\
      ` cd ../frontend`\
      `npm install`\
      `npm run dev`

2.  With docker

    - clone the project:\
      `docker compose up -d`

3.  With docker pull:\
    `docker pull bhuwanluffy/mozzarella-editor`

### Contributing

Want to contribute? Create a Pull Request!

No time? [Become a sponsor](https://github.com/sponsors/bhuwanpp) and support the project
