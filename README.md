# Movies-API-Client-Side-Application

React movie search client powered directly by the OMDb API. It includes a carousel home page, movie search with AG Grid infinite scrolling, movie details, and local demo registration/login flows.

## Features

- Modern header with navigation, auth actions, and global theme toggle
- Home carousel with navigation to Movies, Register, and Login
- Simple movie filters for title, year, and type
- Sortable movie result columns
- Infinite scrolling movie table using AG Grid
- Movie detail pages with poster previews and login-gated full details
- Full detail view shows every available OMDb detail field used by the app, including plot, ratings, people, awards, box office, language, and IMDb metadata
- Local browser-based registration, login, and logout demo
- No separate backend or database required

## Requirements

- Node.js
- npm
- OMDb API key

Create a free API key from [omdbapi.com](https://www.omdbapi.com/), then set it as `REACT_APP_OMDB_API_KEY`.

## Install

```bash
npm install
```

## Run Locally

PowerShell:

```powershell
$env:PORT="3001"
$env:REACT_APP_OMDB_API_KEY="your_omdb_api_key"
npm start
```

macOS/Linux:

```bash
PORT=3001 REACT_APP_OMDB_API_KEY=your_omdb_api_key npm start
```

Open:

```text
http://localhost:3001
```

## Build

```bash
npm run build
```

## Environment

```text
PORT=3001
REACT_APP_OMDB_API_KEY=your_omdb_api_key
```

## API Usage

The app calls OMDb directly from the browser:

- Search movies with the `s`, `y`, `type=movie`, and `page` parameters
- Load movie details with the `i` and `plot=full` parameters

OMDb does not provide actor profile pages or user account endpoints, so the actor route displays a friendly unavailable message and auth is kept as a local demo flow. The movie detail page displays all people data returned by OMDb for the selected title.

## Project Structure

```text
public/             HTML template
src/api/            OMDb and local auth helpers
src/components/     Shared React components
src/images/         Carousel and auth page images
src/pages/          Page components and page CSS
src/App.js          Routes and app shell
src/AuthContext.js  Authentication state
src/ThemeContext.js Theme state
src/index.js        React entry point
src/styles.css      Global theme styles
```

## Troubleshooting

- If the movie list does not load, confirm `REACT_APP_OMDB_API_KEY` is set before starting the app.
- If OMDb says `Invalid API key`, create or verify the key at [omdbapi.com](https://www.omdbapi.com/).
- If you change the API key while the app is running, stop `npm start` and start it again.
- If port `3001` is busy, set `PORT` to another value.
