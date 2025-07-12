# Backend Server

This directory contains a simple Express backend used for the Crypto Charity Tracker application.

## Requirements
- Node.js 18+ (already included in the project environment)

## Setup
1. Install dependencies from the project root:
   ```sh
   npm install
   ```
2. Run the server:
   ```sh
   npm run server
   ```

The server listens on `PORT` (default `3001`).

## API
### `GET /api/charities`
Returns the list of mock charities.

### `GET /api/donations`
Returns all recorded donations.

### `POST /api/donations`
Adds a new donation. Request body should include:

```json
{
  "charityId": number,
  "amount": number,
  "name": string,       // optional
  "message": string     // optional
}
```

If `API_KEY` is defined in `.env`, clients must include the same key in the `x-api-key` header when calling this endpoint.

## Environment Variables
- `PORT` – Port number the server should listen on (optional, defaults to `3001`).
- `API_KEY` – Optional key required to authorize donation creation.

## Persistent Data
Donations are stored in `server/data/donations.json`. This file is created automatically on first run.

