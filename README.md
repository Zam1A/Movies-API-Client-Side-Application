# Movies API Client Side Application

An Express and MySQL movie information API with Swagger documentation, JWT authentication, movie search, movie detail, people detail, and user profile endpoints.

## Tech Stack

- Node.js
- Express
- MySQL / mysql2
- Knex
- JSON Web Tokens
- Swagger UI
- Pug

## Prerequisites

- Node.js
- npm
- MySQL Server

## Setup

Install dependencies:

```bash
npm install
```

Create and seed the MySQL database by importing the SQL files in this order:

```bash
mysql -u root -p < sqls/movie.sql
mysql -u root -p movies < sqls/user.sql
```

The default database name is `movies`.

## Configuration

The app works with the default MySQL settings below, or you can override them with environment variables.

| Variable | Default |
| --- | --- |
| `MYSQL_HOST` | `127.0.0.1` |
| `MYSQL_PORT` | `3306` |
| `MYSQL_USER` | `root` |
| `MYSQL_PASSWORD` / `MYSQL_PSW` | `Cab230!` |
| `MYSQL_DB` | `movies` |

Example:

```bash
MYSQL_USER=root MYSQL_PASSWORD=your-password npm start
```

On Windows PowerShell:

```powershell
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="your-password"
npm start
```

## Run

Start the server:

```bash
npm start
```

Open the API documentation:

```text
http://localhost:3000
```

## Main Endpoints

- `GET /movies/search`
- `GET /movies/data/:id`
- `GET /people/:id`
- `POST /user/register`
- `POST /user/login`
- `POST /user/refresh`
- `POST /user/logout`
- `GET /user/:email/profile`
- `PUT /user/:email/profile`

Some people and profile routes require a bearer token. Use `/user/login` to get the token, then send it with:

```text
Authorization: Bearer <token>
```

## Project Structure

```text
bin/            Server entry point
config/         MySQL and JWT configuration
db/             Knex database queries
helpers/        Shared response and token helpers
middlewares/    Authentication middleware
routes/         Express route handlers
sqls/           Database seed files
swagger/        OpenAPI specification
views/          Pug templates
```

## Troubleshooting

- The Swagger page can load without MySQL.
- Data endpoints need MySQL running and the SQL files imported.
- If a data endpoint returns `Internal Server Error`, check the MySQL host, port, username, password, and database name.
- If port `3000` is already in use, set `PORT` before starting the app.
