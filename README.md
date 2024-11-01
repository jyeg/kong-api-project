# Kong API Project

## Description

This project is a simple API for a Kong Take Home Assignment. It is built with NestJS and uses Typeorm to interact with PostgreSQL. It exposes Swagger docs at `/docs` and uses Docker Compose to run the database.

## Table of Contents

- [Description](#description)
- [Tech & System Requirements](#tech--system-requirements)
- [Installation / Setup](#installation--setup)
- [Usage](#usage)

## Tech & System Requirements

- NodeJS
- Yarn
- NestJS
- TypeORM
- PostgreSQL
- Docker

## Installation / Setup

A step-by-step guide to setting up the project:

Install Docker.

1. Clone the repository: `git clone https://github.com/your-username/kong-api-project.git`
2. Navigate to the project directory: `cd kong-api-project`
3. Install dependencies: `yarn`
4. Start the database && Start the application: `yarn start:dev`

## Usage

The Kong API Project provides a comprehensive API for managing data. The API endpoints are documented using Swagger and can be accessed at `http://localhost:3000/docs`.

## Project Structure

/src
├── common
├── database
├── providers
├── filters
├── interfaces
├── modules
├── app.module.ts
├── main.ts

## Running the project

### Install dependencies

```bash
yarn install
```

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

### Start the development server

```bash
yarn dev:debug
```

### Run tests

```bash
yarn test
```

### Environment variables

Copy `.env.example` file and create `.env` with your own values.

```bash
cp .env.example .env
```

### Migrations

To create a new migration:

```bash
yarn migration:generate src/migrations/<migration-name>
```

To run migrations:

```bash
yarn migration:run
```

To revert a migration:

```bash
yarn migration:revert
```

## Features
