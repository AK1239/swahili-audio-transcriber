# Swahili Audio Transcriber

A clean architecture-based application for transcribing and summarizing Swahili audio meetings using OpenAI Whisper and GPT.

## Features

- 🎤 Upload audio files (.mp3, .wav, .mp4)
- 📝 Automatic Swahili transcription using OpenAI Whisper
- 📊 Structured Swahili summaries with:
  - Brief summary (Muhtasari mfupi)
  - Important decisions (Maamuzi muhimu)
  - Action items (Kazi za kufuatilia)
  - Deferred topics (Masuala yaliyoahirishwa)
- 🔄 Code-switching support (Swahili + English)
- 🏗️ Clean Architecture with dependency injection
- 🧪 Comprehensive test suite
- 🚀 Ready for cloud deployment

## Architecture

The application follows Clean Architecture principles:

- **Domain Layer**: Business entities, value objects, and interfaces
- **Application Layer**: Use cases and DTOs
- **Infrastructure Layer**: Database, external APIs, file storage
- **Presentation Layer**: FastAPI routes and React components

## Tech Stack

### Backend

- Python 3.11+
- FastAPI
- SQLAlchemy 2.0 (async)
- OpenAI API (Whisper + GPT)
- Dependency Injection
- Pydantic v2
- Alembic (migrations)

### Frontend

- React 18+ with TypeScript
- Vite
- React Query
- Tailwind CSS
- Axios

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- OpenAI API key

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy environment file and configure
cp .env.example .env
# Edit .env with your OpenAI API key and other settings

# Initialize database
alembic upgrade head

# Run development server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with API URL (default: http://localhost:8000/api/v1)

# Run development server
npm run dev
```

## Project Structure

```
backend/
├── app/
│   ├── domain/          # Business logic
│   ├── application/      # Use cases
│   ├── infrastructure/   # External dependencies
│   └── presentation/     # API layer
├── tests/               # Test suite
└── alembic/             # Database migrations

frontend/
├── src/
│   ├── api/             # API client
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks
│   ├── services/        # Business logic
│   └── types/           # TypeScript types
```

## API Endpoints

- `POST /api/v1/upload` - Upload audio file
- `GET /api/v1/transcript/{id}` - Get transcript
- `GET /api/v1/summary/{id}` - Get summary

## Testing

```bash
# Backend tests
cd backend
pytest

# With coverage
pytest --cov=app
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

Free tier options:

- Railway (backend) + Vercel (frontend)
- Render (backend) + Netlify (frontend)
- Fly.io (full stack)

## Cost Estimation

- ~$0.20-0.30 per 30-minute meeting
- Uses GPT-3.5-turbo for cost efficiency

## License

MIT

## Contributing

Contributions welcome! Please follow clean architecture principles and maintain test coverage.
