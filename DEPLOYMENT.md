# Deployment Guide

This guide covers deploying the Swahili Audio Transcriber application to various platforms.

## Prerequisites

- Python 3.11+ installed
- Node.js 18+ and npm installed
- OpenAI API key
- PostgreSQL database (for production) or SQLite (for development)

## Local Development Setup

### Backend

1. Navigate to backend directory:

```bash
cd backend
```

2. Create virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your OpenAI API key
```

5. Initialize database:

```bash
alembic upgrade head
```

6. Run development server:

```bash
uvicorn app.main:app --reload
```

### Frontend

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your API URL
```

4. Run development server:

```bash
npm run dev
```

## Free Tier Cloud Deployment

### Option 1: Railway (Recommended)

**Backend:**

1. Create account at [Railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Add PostgreSQL service
5. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway when you add PostgreSQL)
   - `OPENAI_API_KEY` (your OpenAI API key)
   - `ENVIRONMENT=production`
   - `CORS_ORIGINS=https://your-frontend-domain.com` (your Vercel/Netlify URL)
   - `STORAGE_TYPE=r2` (for cloud storage)
   - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` (Cloudflare R2 credentials)
6. Run database migrations: `alembic upgrade head` (Railway can run this automatically)
7. Deploy

**Frontend:**

1. Deploy to Vercel (free tier)
2. Set environment variable:
   - `VITE_API_URL=https://your-backend-url.railway.app/api/v1`

### Option 2: Render

**Backend:**

1. Create account at [Render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Add PostgreSQL database
5. Set environment variables (same as Railway)
6. Deploy

**Frontend:**

1. Deploy to Vercel or Netlify (both have free tiers)

### Option 3: Fly.io

**Backend:**

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Launch app: `fly launch`
4. Set secrets: `fly secrets set OPENAI_API_KEY=your-key`
5. Deploy: `fly deploy`

## Database Migrations

Run migrations before deployment:

```bash
cd backend
alembic upgrade head
```

For production, set `DATABASE_URL` environment variable and run:

```bash
alembic upgrade head
```

## Environment Variables

### Backend

**Required:**

- `OPENAI_API_KEY`: Your OpenAI API key

**Database (Required for Production):**

- `DATABASE_URL`: Database connection string
  - **Development**: SQLite (default) - `sqlite+aiosqlite:///./transcriptions.db`
  - **Production**: PostgreSQL - `postgresql+asyncpg://user:password@host:port/dbname`

**File Storage:**

- `STORAGE_TYPE`: `"local"` (default) or `"r2"` (for Cloudflare R2)
- **If using R2 (Required when STORAGE_TYPE=r2):**
  - `R2_ACCOUNT_ID`: Cloudflare account ID
  - `R2_ACCESS_KEY_ID`: R2 access key ID
  - `R2_SECRET_ACCESS_KEY`: R2 secret access key
  - `R2_BUCKET_NAME`: R2 bucket name

**Optional:**

- `ENVIRONMENT`: `development` or `production` (default: `development`)
- `LOG_LEVEL`: Logging level (default: `INFO`)
- `CORS_ORIGINS`: Comma-separated list of allowed origins (default: `http://localhost:5173`)
- `UPLOAD_DIR`: Directory for file uploads (default: `./uploads`) - only used if `STORAGE_TYPE=local`
- `MAX_FILE_SIZE_MB`: Maximum file size in MB (default: `25`)
- `ALLOWED_EXTENSIONS`: Comma-separated list (default: `mp3,wav,mp4,webm`)
- `OPENAI_MODEL`: OpenAI model for summarization (default: `gpt-3.5-turbo`)
- `OPENAI_WHISPER_MODEL`: OpenAI Whisper model (default: `whisper-1`)

### Frontend

**Required:**

- `VITE_API_URL`: Backend API URL
  - **Development**: `http://localhost:8000/api/v1`
  - **Production**: `https://your-backend-url.railway.app/api/v1` (or your backend URL)

## File Storage

Cloud storage is **required for production** as local file storage won't persist on most hosting platforms.

**Recommended: Cloudflare R2 (Free Tier)**

- ✅ 10GB storage free
- ✅ Unlimited egress (no bandwidth charges)
- ✅ S3-compatible API
- ✅ Already implemented in the codebase

**Setup:**

1. Create Cloudflare account at [cloudflare.com](https://cloudflare.com)
2. Enable R2 in dashboard
3. Create a bucket
4. Create API tokens (Manage R2 API Tokens)
5. Set environment variables (see above)

## Monitoring

Consider adding:

- Sentry for error tracking
- Logging service (Logtail, Datadog)
- Uptime monitoring (UptimeRobot - free tier)

## Cost Estimation

- **OpenAI Whisper API**: ~$0.006 per minute of audio
- **OpenAI GPT-3.5-turbo**: ~$0.001 per 1K tokens
- **Estimated cost per 30-minute meeting**: ~$0.20-0.30

## Troubleshooting

### Database Connection Issues

Ensure `DATABASE_URL` is correctly formatted:

- PostgreSQL: `postgresql+asyncpg://user:password@host:port/dbname`
- SQLite: `sqlite+aiosqlite:///./transcriptions.db`

### CORS Issues

Ensure `CORS_ORIGINS` includes your frontend URL.

### File Upload Issues

Check:

- `UPLOAD_DIR` exists and is writable
- `MAX_FILE_SIZE_MB` is appropriate
- File permissions

## Security Considerations

1. Never commit `.env` files
2. Use environment variables for all secrets
3. Enable HTTPS in production
4. Set appropriate CORS origins
5. Validate file uploads
6. Rate limit API endpoints (future enhancement)
