"""Transcription provider interface"""
from abc import ABC, abstractmethod


class TranscriptionProvider(ABC):
    """Interface for speech-to-text providers"""
    
    @abstractmethod
    async def transcribe(
        self,
        audio_file: bytes,
        language_hint: str = "sw",
    ) -> str:
        """
        Transcribe audio to text
        
        Args:
            audio_file: Audio file bytes
            language_hint: Language code hint (default: "sw" for Swahili)
        
        Returns:
            Transcribed text
        
        Raises:
            TranscriptionProviderError: If transcription fails
        """
        pass

