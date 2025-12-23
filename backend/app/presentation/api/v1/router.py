"""API v1 router"""
from fastapi import APIRouter

from app.presentation.api.v1.endpoints import audio, summary, transcript, upload

api_router = APIRouter()

api_router.include_router(upload.router, tags=["upload"])
api_router.include_router(transcript.router, tags=["transcript"])
api_router.include_router(summary.router, tags=["summary"])
api_router.include_router(audio.router, tags=["audio"])

