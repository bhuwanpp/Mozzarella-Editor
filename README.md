## Mozzarella Editor

### Description

Mozzarella JS aims to provide an advanced online JavaScript code editor and compiler similar to online js compiler. It will enable users to write, compile, and execute JavaScript code directly within their web browsers.

### Motivation

- let's make own online js code editor to run some js code.
- while learning the docs we can run code in online to check js features.

Features

- Code Execution: Run JavaScript code and view the output.
- Code Editor: Write and edit JavaScript code with real-time syntax highlighting and error reporting.
- LSP Integration: Auto-completion and error diagnostics using Language Server Protocol.
- File Management: Create, save, and load files; handle file operations and storage.
- Theming: Toggle between light and dark modes.
- User Authentication: Sign up, log in, and manage user sessions.
- Password Management: Update user passwords securely.

Technologies Used

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

1.  without docker

    - Clone the project
    - git clone `git@github.com:bhuwanpp/Mozzarella-Editor.git`
    - cd Mozzarella-Editor
    - cd backend
    - npm install
    - npm start
    - and
    - cd frontend
    - npm install
    - npm run dev

2.  with docker

    - clone the project
    - docker compose up -d

3.  with docker pull
    - docker pull bhuwanluffy/mozzarella-ediror

### Contributing

Want to contribute? create a PR.

No time? Then [become a sponsor](https://github.com/sponsors/bhuwanpp)
