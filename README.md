# CAB230 Movies API Client Side Application

React client for the CAB230 Movies API. The app matches the submitted A2 report: it includes a carousel home page, movie search with AG Grid infinite scrolling, movie details, actor details with a ratings chart, registration, login, token refresh, and logout.

## Features

- Home carousel with navigation to Movies, Register, and Login
- Movie search by title and year
- Infinite scrolling movie table using AG Grid
- Clickable movie rows leading to movie detail pages
- Movie detail page with poster, plot, ratings, and clickable cast table
- Protected actor detail page
- Automatic bearer token refresh on actor detail requests
- Actor movie list with pagination
- IMDb rating histogram using Chart.js
- Registration, login, and logout flows

## Requirements

- Node.js
- npm
- A running CAB230 Movies API server

The frontend reads the API URL from `REACT_APP_API_BASE_URL`. If it is not set, it uses `http://localhost:3000`.

## Install

```bash
npm install
```

## Run Locally

Start the API server first. For the backend project in this workspace, import the SQL files and run it on port `3000`.

Then start this React app on port `3001`.

PowerShell:

```powershell
$env:PORT="3001"
$env:REACT_APP_API_BASE_URL="http://localhost:3000"
npm start
```

macOS/Linux:

```bash
PORT=3001 REACT_APP_API_BASE_URL=http://localhost:3000 npm start
```

Open:

```text
http://localhost:3001
```

## Build

```bash
npm run build
```

## API Endpoints Used

- `GET /movies/search`
- `GET /movies/data/:imdbID`
- `GET /people/:id`
- `POST /user/register`
- `POST /user/login`
- `POST /user/refresh`
- `POST /user/logout`

## Project Structure

```text
public/             HTML template
src/api/            API client helpers
src/components/     Shared React components
src/images/         Carousel and auth page images
src/pages/          Page components and page CSS
src/App.js          Routes and app shell
src/AuthContext.js  Authentication state
src/index.js        React entry point
```

## Troubleshooting

- If the movie list does not load, confirm the API server is running and `REACT_APP_API_BASE_URL` points to it.
- If movie or actor data returns `Internal Server Error`, check the API database connection and imported SQL data.
- If the actor page asks you to log in, register or log in first, then click the actor link again.
- If port `3000` is already used by the API, run the React app on `3001` as shown above.
