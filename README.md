# Kong API Project

## Table of Contents

- [Description](#description)
- [Tech & System Requirements](#tech--system-requirements)
- [Features](#features)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Installation / Setup](#installation--setup)
- [Running the project](#running-the-project)
- [Design Considerations](#design-considerations)
- [Assumptions](#assumptions)
- [Trade-offs and TODOs](#trade-offs-and-todos)

## Description

This project is a simple API for a Kong Take Home Assignment. It is built with NestJS and uses Typeorm to interact with PostgreSQL. It exposes Swagger docs at `/docs` and uses Docker Compose to run the database and other resources.

## Tech & System Requirements

- NodeJS
- Yarn
- NestJS
- TypeORM
- PostgreSQL
- Docker

## Features

- Service Group Search
- Service Group CRUD
- User Authentication/Authorization
- End-to-end tests
- Unit tests
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

### Run end-to-end tests

```bash
yarn test:e2e
```

## Design Considerations

### Architecture

- Followed NestJS modular architecture for clear separation of concerns
- Used Repository pattern with TypeORM for database operations
- Implemented Guards for basic authentication and basic authorization
- Used DTOs for request/response data validation
- Implemented entity-based data model with relationships (User-Team-ServiceGroup)

### Security

- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control (USER, ADMIN roles)
- Request validation using class-validator
- Protected routes using Guards

### Testing

- Comprehensive unit tests for services and controllers
- End-to-end tests for critical flows (auth, CRUD operations)
- Mocked dependencies for isolated unit testing

### API Design

- RESTful endpoints following REST conventions
- Swagger documentation for API visibility
- Consistent error handling and responses
- Pagination for list endpoints
- Search and filtering capabilities

## Assumptions

1. **Authentication**

   - Users belong to a single team at a time
   - Email addresses and usernames are unique across the system

2. **Authorization**

   - Team members can only access their team's resources
   - Service groups are owned by users within teams

3. **Data Model**

   - Teams have multiple users
   - Users can create multiple service groups
   - Service groups belong to a single user
   - Service groups have many versions

4. **Performance**

   - Database queries are optimized for small to medium datasets
   - Pagination is required for large result sets

## Trade-offs and TODOs

1. **Performance vs Simplicity**

   - Used TypeORM QueryBuilder for complex queries instead of raw SQL
   - Attempted to
   - TODO: Implement more sophisticated caching strategies for high-traffic endpoints

2. **Security vs Usability**

   - Implemented basic JWT authentication
   - TODO: Auth Endpoint should have better role based validation
   - TODO: TBD on how to handle team assignment for registration endpoint
   - TODO: Implement rate limiting for API endpoints

3. **Development Speed vs Scalability**

   - Used TypeORM simple search on service groups
   - TODO: consider using full text search in version with JSONB for better search results
   - TODO: consider using Redis for caching

4. **Testing Coverage vs Time**

   - Focused on critical path testing

5. **Features vs Timeline**
   - Implemented core CRUD functionality for Service Groups
   - TODO: Edge cases for deleting resources, should be soft delete, and prevent orphan services.
   - TODO: create a separate db for dev and another for e2e tests
   - TODO: Add advanced search capabilities
   - TODO: Add audit logging for all operations
