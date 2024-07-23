# Backend Assignment-7

# Introduction

Creating the basic CRUD Todo app API using authentication with Node.js, Express and Knex.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
   - [Pulling the Docker Image](#pulling-the-docker-image)
   - [Running the Docker Container](#running-the-docker-container)
4. [Accessing the API for Authentication](#accessing-the-api-for-authentication)
5. [Accessing the API for ToDo Tasks](#accessing-the-api-for-todo-tasks)
6. [Unit Test](#running-unit-tests)
7. [Integration Test](#running-integration-tests)

## Features

- Authentication: Users can sign up, log in, and receive JWT tokens for authentication.
- Todo Operations: CRUD operations (Create, Read, Update, Delete) are supported for Todo tasks.
- Security: JWT tokens are used to authenticate and authorize users, ensuring secure access to the API endpoints.

## Prerequisites

You need to have Docker installed on your machine.

## Getting Started

1. Using Docker

### Pulling the Docker Image

To get started with this application, pull the Docker image from Docker Hub using the following command:

`docker pull bhuwanluffy/node-assignment-7`

### Running the Docker Container

Once you have pulled the Docker image, you can run it using the following command:

`docker run -d -p 3000:3000 bhuwanluffy/node-assignment-7`

2. Using Github

### Clone the repository

`git@github.com:bhuwanpp/backend-assignment-7.git`

### Running with Docker Compose

`docker-compose up -d`

### Accessing the API for authentication

You can now access the Todo app API by opening a web browser or using a tool like curl and navigating to <http://localhost:3000/>.

Example API Endpoints:

    GET /users: Retrieve all users only from super admin.
    GET /users/{id}: Retrieve a specific user by ID.
    POST /auth/signup: Create a new user only from super admin.

        {
            "email":"one@gamil.com",
            "password":"1234",
            "userId":"1"
        }

    POST /auth/login: Log in user.
     {
            "email":"one@gamil.com",
            "password":"1234"
        }
    PUT /users/id: Update user  only from super admin.
     {
            "email":"one@gamil.com",
            "password":"1234"
        }

    PUT /users/id: Delete  user  only from super admin.

    GET /auth/refresh-token: Refresh token for user.
        put access token in bearer of  auth
        {
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
        }

### Accessing the API for todo tasks

You can now access the Todo app API by opening a web browser or using a tool like curl and navigating to <http://localhost:3000/>.

Example API Endpoints:

    GET /tasks: Retrieve all tasks.
      put access token in bearer of  auth
        {
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
        }

    GET /tasks/{id}: Retrieve a specific task by ID.
      put access token in bearer of  auth
        {
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
        }

    POST /tasks: Create a new task.
        {

        "todo":"learn java ",
        "userId":"3"
        }

    PUT /tasks/{id}: Update an existing task by ID.
        {
        "todo":"learn js ",
        "userId":"3"
        }
    DELETE /tasks/{id}: Delete a task by ID.
       put access token in bearer of  auth
        {
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
        }

### Running Unit Tests

Unit tests are located in the tests/unit_test/ directory. To run all unit tests:

`npm run test`

### Running Integration tests

Integration tests are located in the tests/integration/ directory. To run all integration tests:

`npm run test:integration`
