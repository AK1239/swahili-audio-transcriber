"""OpenAI Whisper transcription provider"""
import io
from typing import BinaryIO

from openai import AsyncOpenAI

from app.domain.exceptions.validation_exceptions import TranscriptionProviderError
from app.domain.interfaces.transcription_provider import TranscriptionProvider
from app.shared.logging import get_logger

logger = get_logger(__name__)


class OpenAIWhisperProvider(TranscriptionProvider):
    """OpenAI Whisper API implementation"""
    
    def __init__(self, client: AsyncOpenAI, model: str = "whisper-1"):
        self._client = client
        self._model = model
    
    async def transcribe(
        self,
        audio_file: bytes,
        language_hint: str = "sw",
    ) -> str:
        """
        Transcribe audio to text using OpenAI Whisper API
        
        Args:
            audio_file: Audio file bytes
            language_hint: Language code hint (default: "sw" for Swahili)
        
        Returns:
            Transcribed text
        
        Raises:
            TranscriptionProviderError: If transcription fails
        """
        logger.info(
            "transcription.started",
            language=language_hint,
            file_size=len(audio_file),
        )
        
        try:
            # Create a file-like object from bytes
            audio_file_obj = io.BytesIO(audio_file)
            audio_file_obj.name = "audio.mp3"  # Whisper API needs a filename
            
            # Call OpenAI Whisper API
            response = await self._client.audio.transcriptions.create(
                model=self._model,
                file=audio_file_obj,
                language=language_hint,
                response_format="text",
            )
            
            transcript = response if isinstance(response, str) else str(response)
            
            logger.info(
                "transcription.completed",
                language=language_hint,
                transcript_length=len(transcript),
            )
            
            return transcript
        
        except Exception as e:
            # Don't log here - let the application layer handle error logging
            raise TranscriptionProviderError(
                f"Failed to transcribe audio: {str(e)}"
            ) from e

