# Kong API Project

## Table of Contents

- [Description](#description)
- [Tech & System Requirements](#tech--system-requirements)
- [Features](#features)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Installation / Setup](#installation--setup)
- [Running the project](#running-the-project)

## Description

This project is a simple API for a Kong Take Home Assignment. It is built with NestJS and uses Typeorm to interact with PostgreSQL. It exposes Swagger docs at `/docs` and uses Docker Compose to run the database and other resources.

## Tech & System Requirements

- NodeJS
- Yarn
- NestJS
- TypeORM
- PostgreSQL
- Docker
- Redis

## Features

- Service Group Search
- Service Group CRUD
- User Authentication/Authorization
- Redis Caching for Service Group Search
- Swagger API Documentation

## Usage

The Kong API Project provides a comprehensive API for managing data. The API endpoints are documented using Swagger and can be accessed at `http://localhost:3000/docs`.

## Project Structure

- **common**: This directory contains utility files for the application, including:
  - **decorators**: Custom decorators for the application.
  - **enums**: Enumerations used in the application.
  - **filters**: Custom exception filters for the application.
  - **guards**: Custom guards for the application.
  - **interceptors**: Custom interceptors for the application.
  - **middlewares**: Custom middlewares for the application.
  - **pipes**: Custom pipes for the application.
  - **utils**: Utility functions for the application.
- **database**: This directory contains scripts for database management, including:
  - **migrations**: Database migration scripts.
  - **seeders**: Database seed scripts.
- **modules**: This directory contains modules for the application, including:
  - **resource**: This module contains:
    - **controllers**: Controllers for the resource module.
    - **dto**: Data transfer objects for the resource module.
    - **entities**: Entities for the resource module.
    - **services**: Services for the resource module.
    - **resource.module.ts**: Module file for the resource module.
- **app.module.ts**: Main module file for the application.
- **main.ts**: Main entry point for the application.

## Installation / Setup

A step-by-step guide to setting up the project:

1. Install Docker.
2. Clone the repository: `git clone https://github.com/jyeg/kong-api-project.git`
3. Navigate to the project directory: `cd kong-api-project`
4. Install dependencies: `yarn`
5. Copy `.env.example` file and create `.env` with your own values.

```bash
cp .env.example .env
```

## Running the project

### Setting up the database

This project uses Docker to set up a PostgreSQL database. Make sure you have Docker and Docker Compose installed on your system.

To start the database:

```bash
yarn db:up
```

To stop the database:

```bash
yarn db:down
```

### Migrations

To create a new migration:

```bash
yarn migration:generate src/database/migrations/<migration-name>
```

To run migrations:

```bash
yarn migration:run
```

To revert a migration:

```bash
yarn migration:revert
```

### Seeding the database

```bash
yarn seed
```

### Start the development server

```bash
yarn start:dev
```

### Run tests

```bash
yarn test
```
