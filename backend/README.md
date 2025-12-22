# Swahili Audio Transcriber - Backend

Backend API for Swahili audio transcription and summarization using clean architecture principles.

## Setup

1. Create virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

3. Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
# Edit .env with your OpenAI API key
```

4. Initialize database:

```bash
alembic upgrade head
```

5. Run development server:

```bash
uvicorn app.main:app --reload
```

## Architecture

This project follows Clean Architecture with four main layers:

- **Domain**: Business entities, value objects, and interfaces
- **Application**: Use cases and DTOs
- **Infrastructure**: Database, external APIs, file storage
- **Presentation**: FastAPI routes and schemas

## Testing

```bash
pytest
pytest --cov=app
```
