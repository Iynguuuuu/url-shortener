# Shortly — A URL Shortener

A full-stack URL shortener with click analytics, built as a DevOps-focused portfolio project.

**Stack:** React + Tailwind · Spring Boot (Java 17) · MongoDB · Docker · GitHub Actions CI/CD

---

## What it does

- Paste a long URL → get a short link (e.g. `https://short.ly/aZ3k9`)
- Visiting the short link redirects to the original and **counts the click**
- A dashboard lists every link with its live click count

---

## Architecture

```
┌─────────────┐      HTTP/JSON       ┌──────────────┐      ┌─────────┐
│   React +   │ ───────────────────► │ Spring Boot  │ ───► │ MongoDB │
│  Tailwind   │ ◄─────────────────── │     API      │ ◄─── │         │
└─────────────┘                      └──────────────┘      └─────────┘
   (nginx)                              (port 8080)          (port 27017)
```

**API endpoints**

| Method | Path                       | Purpose                              |
|--------|----------------------------|--------------------------------------|
| POST   | `/api/shorten`             | Create a short link from a long URL  |
| GET    | `/api/urls`                | List all links (newest first)        |
| GET    | `/api/urls/{code}/stats`   | Analytics for one link               |
| GET    | `/{code}`                  | Redirect to original + count a click |

---

## Prerequisites (install these first)

| Tool    | Why          | Check it's installed    |
|---------|--------------|-------------------------|
| Java 17 | Spring Boot  | `java -version`         |
| Maven   | Builds the backend | `mvn -version`    |
| Node 20 | React build  | `node -version`         |
| Docker  | Containers + local DB | `docker -version` |

> On Windows, use [SDKMAN](https://sdkman.io/) or the installers from Adoptium (Java) and nodejs.org. Docker Desktop covers Docker.

---

## Option A — Run everything with Docker (easiest)

This is the "one command" path. It starts MongoDB, the backend, and the frontend together.

```bash
cd url-shortener
docker compose up --build
```

Then open:
- Frontend → http://localhost:3000
- Backend API → http://localhost:8080/api/urls

Stop it with `Ctrl+C`, and `docker compose down` to remove the containers.

---

## Option B — Run each part by hand (good for learning)

Since Spring Boot is new to you, running the backend manually once helps you see what's happening.

### 1. Start MongoDB

Easiest is Docker just for the DB:

```bash
docker run -d -p 27017:27017 --name shortly-mongo mongo:7
```

(Or install [MongoDB Community](https://www.mongodb.com/try/download/community) locally.)

### 2. Start the backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

What happens:
- Maven downloads dependencies (first run is slow — that's normal)
- Spring Boot starts an embedded Tomcat server on **port 8080**
- It connects to MongoDB using the URI in `src/main/resources/application.properties`

You'll know it worked when you see `Started UrlShortenerApplication` in the logs.

Test it without the frontend:

```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://anthropic.com"}'
```

You should get back JSON with a `shortUrl`. Open that short URL in a browser — it redirects, and the click count goes up.

### 3. Start the frontend (React)

In a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The app talks to the backend on :8080.

---

## Understanding the backend (quick tour for a first-timer)

Spring Boot apps are organized in layers. Follow a request through them:

1. **Controller** (`controller/`) — receives the HTTP request. `UrlController` handles `/api/*`; `RedirectController` handles the short-link clicks.
2. **Service** (`service/UrlService.java`) — the business logic: generating codes, counting clicks. Controllers stay thin and delegate here.
3. **Repository** (`repository/UrlRepository.java`) — talks to MongoDB. You just declare method names and Spring writes the queries.
4. **Model** (`model/UrlMapping.java`) — the shape of a document in the database.

The annotations do a lot of magic:
- `@RestController` — this class handles web requests
- `@Service` / `@Repository` — Spring creates and injects these for you
- `@Document` — maps a Java class to a MongoDB collection

Dependencies are "injected" via constructors — you never call `new UrlService()` yourself; Spring builds and wires everything at startup.

---

## The CI/CD pipeline (the DevOps part)

The pipeline lives in `.github/workflows/ci.yml`. It runs on GitHub automatically whenever you push.

**What it does, in order:**

1. **`backend-test`** — sets up Java 17, runs the JUnit tests with `mvn test`.
2. **`frontend-test`** — sets up Node 20, runs ESLint, the Vitest tests, and a production build.
3. **`docker-build`** — *only if both test jobs pass and you pushed to `main`* — builds the backend and frontend Docker images and pushes them to the GitHub Container Registry (GHCR).

This is a genuine **CI (test) → CD (build & publish)** flow, which is exactly the DevOps story you want on a CV.

### To make the pipeline run

1. Create a new repo on GitHub and push this project:
   ```bash
   cd url-shortener
   git init
   git add .
   git commit -m "Initial commit: URL shortener"
   git branch -M main
   git remote add origin https://github.com/<your-username>/url-shortener.git
   git push -u origin main
   ```
2. Go to the **Actions** tab on GitHub — you'll see the pipeline running.
3. After it passes, check **Packages** on your profile for the two published images.

> No secrets to configure — `GITHUB_TOKEN` is provided automatically. The first time, go to the repo's **Settings → Actions → General** and make sure workflows have **Read and write permissions** (needed to push images).

---

## Deploy it live (one cloud deploy)

The simplest free path:

### 1. Database — MongoDB Atlas (free tier)
- Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Create a database user and allow network access from anywhere (`0.0.0.0/0`)
- Copy the connection string (looks like `mongodb+srv://user:pass@cluster.../urlshortener`)

### 2. Backend — Render (or Railway / Fly.io)
- New **Web Service** → connect your GitHub repo → root directory `backend`
- Render auto-detects the `Dockerfile`
- Set environment variables:
  - `MONGODB_URI` = your Atlas string
  - `APP_BASE_URL` = your Render backend URL (e.g. `https://shortly-api.onrender.com`)
  - `APP_CORS_ALLOWED_ORIGINS` = your frontend URL (step 3)

### 3. Frontend — Render Static Site (or Vercel / Netlify)
- New **Static Site** → root directory `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL` = your backend URL from step 2

Once all three are up, your short links are live on the internet — put the link on your CV.

---

## For your CV

> **Shortly — Full-stack URL shortener with CI/CD** · React, Tailwind, Spring Boot, MongoDB, Docker, GitHub Actions
> Built a URL shortener with click analytics. Containerized both services with multi-stage Docker builds and set up a GitHub Actions pipeline that runs backend (JUnit) and frontend (Vitest) tests, then builds and publishes images to the container registry. Deployed to the cloud with a managed MongoDB.

---

## Project structure

```
url-shortener/
├── README.md
├── docker-compose.yml          # run the whole stack locally
├── .github/workflows/ci.yml    # the CI/CD pipeline
├── backend/                    # Spring Boot API
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       ├── main/java/com/iynk/urlshortener/
│       │   ├── controller/     # HTTP endpoints
│       │   ├── service/        # business logic
│       │   ├── repository/     # MongoDB access
│       │   ├── model/          # DB document
│       │   ├── dto/            # request/response shapes
│       │   ├── config/         # CORS
│       │   └── exception/      # error handling
│       ├── main/resources/application.properties
│       └── test/               # JUnit tests
└── frontend/                   # React + Tailwind
    ├── package.json
    ├── Dockerfile + nginx.conf
    └── src/
        ├── api/                # fetch wrapper
        ├── components/         # ShortenForm, UrlCard
        └── App.jsx
```
