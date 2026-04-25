# Internship Portal Setup & Deployment

Internal documentation for setting up the full-stack internship platform.

## Local Development
1. Backend: Run `.\mvnw.cmd spring-boot:run` from `/backend`.
2. Frontend: Run `npm run dev` from `/frontend`.

## Production Deployment

### 1. Database (PostgreSQL)
- Create a PostgreSQL instance (e.g. on Render/AWS).
- Configure the following environment variables:
  - `SPRING_DATASOURCE_URL` (JDBC URL)
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`

### 2. Backend (Spring Boot)
- Build Command: `./mvnw clean install -DskipTests`
- Start Command: `java -jar target/*.jar`
- Ensure static uploads are handled or use an external service for file storage.

### 3. Frontend (Vite/React)
- Create `.env.production` in `/frontend`:
  `VITE_API_BASE_URL=https://<your-backend-url>/api`
- Build Command: `npm run build`
- Deploy the `/dist` directory to a static host (Netlify/Vercel).

---
*Note: Ensure CORS settings in WebConfig.java are restricted to the production domain before final launch.*
