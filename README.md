# FluxiBiz

FluxiBiz is an advanced multichannel commerce and business management platform designed to centralize and automate the entire lifecycle of modern business operations across digital and physical marketplaces.

- [Scalar API Docs](https://sb-ite-basic-course-api-production.up.railway.app/scalar)
- [Download OpenAPI Document ( JSON )](./public/api-document/api.json)
- [Download OpenAPI Document ( YAML )](./public/api-document/api.yaml)

## Features

- Clean, responsive Next.js frontend for interacting with the backend API
- Interactive API documentation via [Scalar](https://sb-ite-basic-course-api-production.up.railway.app/scalar#introduction) (OpenAPI-powered)
- Postman Collection: Run in Postman or [download](./public/api-document/api.json) the Postman JSON export from the repo.
- Authenticated API flows using Bearer (JWT) tokens
- Example integrations for staff, sales channels, store, and platform resources

## Quick Start / Installation

Prerequisites: Node.js v18+ (or your project's target), optional Docker

1. Clone the repository

```bash
git clone <repo-url>
cd ipos-frontend
```

2. Install dependencies

```bash
npm install
# or
pnpm install
```

3. Create a `.env.local` (copy `.env.example` if provided) and add required values (see Environment Variables below)

4. Run the development server

```bash
npm run dev
# open http://localhost:3000
```

## Interactive API Documentation (Scalar)

This project links to a live Scalar-based API reference. Scalar renders the OpenAPI spec and exposes an interactive docs UI.

- Live Scalar UI: https://sb-ite-basic-course-api-production.up.railway.app/scalar
- OpenAPI JSON: https://sb-ite-basic-course-api-production.up.railway.app/v3/api-docs

If you run the backend locally, serve the OpenAPI JSON at `/v3/api-docs` and open `/scalar` (or the local docs path) to use the interactive tester.

## Core API Endpoints (summary)

Below are some of the primary endpoints surfaced in the OpenAPI spec. For the full list, open the Scalar docs linked above.

- GET /api/v1/platform/staff/{userId} — Get staff detail (Auth: Bearer required)
- PUT /api/v1/sales-channels/{id} — Update sales channel (Auth: Bearer required)
- DELETE /api/v1/sales-channels/{id} — Delete sales channel (Auth: Bearer required)
- GET /api/v1/store/{slug} — Get store by slug (may be public or protected depending on implementation)

Note: Many endpoints are under `/api/v1/...`. Use the OpenAPI JSON or Scalar UI to view request/response schemas and example payloads.

## Environment Variables

Create a `.env.local` with the values below (adjust names to match the project's config loader).

| Key | Default | Description |
|---|---:|---|
| `NODE_ENV` | `development` | Node environment |
| `PORT` | `3000` | Frontend server port |
| `API_BASE_URL` | `https://sb-ite-basic-course-api-production.up.railway.app` | Base URL for backend API |
| `SCALAR_DOCS_URL` | `https://sb-ite-basic-course-api-production.up.railway.app/scalar` | Scalar docs URL |
| `SCALAR_TOKEN` | (none) | Optional: bearer token for testing authenticated calls locally |

## Usage examples

Fetch OpenAPI JSON

```bash
curl -sS https://sb-ite-basic-course-api-production.up.railway.app/v3/api-docs | jq .
```

Authenticated request example (curl)

```bash
curl -sS -H "Authorization: Bearer <TOKEN>" \
  https://sb-ite-basic-course-api-production.up.railway.app/api/v1/platform/staff/<USER_ID>
```

JavaScript (fetch)

```js
const token = process.env.SCALAR_TOKEN;
fetch(`${process.env.API_BASE_URL}/api/v1/platform/staff/USER_ID`, {
  headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

Python (requests)

```py
import os
import requests

TOKEN = os.getenv('SCALAR_TOKEN')
BASE = os.getenv('API_BASE_URL', 'https://sb-ite-basic-course-api-production.up.railway.app')
resp = requests.get(f"{BASE}/api/v1/platform/staff/USER_ID", headers={'Authorization': f'Bearer {TOKEN}'})
print(resp.status_code)
print(resp.json())
```

## Errors & Troubleshooting

- 401 / 403: check Bearer token validity and scopes
- 413: request payload too large — reduce size or send in chunks
- CORS errors (browser): ensure the API allows the requesting origin or use the Scalar UI to test server-side

## Contributing

Contributions are welcome. Please open an issue or a pull request. Include tests and keep changes focused and small.

## License

This project is released under the MIT License. Replace with the correct license if different.

---

If you'd like, I can:

- Fill in the placeholder values: `Project Name`, short description, tech stack, and prerequisites; or
- Keep `API_REFERENCE.md` as the canonical API documentation and add a short link in this README.
