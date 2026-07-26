# backend-blog-post

Express API server for the blog project.

## Setup

```bash
npm install
```

## Run locally

```bash
npm start
```

Server runs at `http://localhost:4000` by default.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check — returns `Hello TechUp!` |
| `GET` | `/profile` | John's profile |

### Example: GET /profile

```bash
curl http://localhost:4000/profile
```

Response (`200`):

```json
{
  "data": {
    "name": "john",
    "age": 20
  }
}
```

## Deploy (Vercel)

Configured via `vercel.json` to build and route through `app.mjs`.
