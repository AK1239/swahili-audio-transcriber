"""OpenAI GPT summarization provider"""
import json
from uuid import UUID

from openai import AsyncOpenAI

from app.domain.entities.summary import ActionItem, Summary
from app.domain.exceptions.validation_exceptions import SummarizationProviderError
from app.domain.interfaces.summarization_provider import SummarizationProvider
from app.application.services.swahili_processor import SwahiliProcessor
from app.infrastructure.providers.prompts import SWAHILI_SUMMARY_PROMPT_TEMPLATE
from app.shared.logging import get_logger

logger = get_logger(__name__)


class OpenAISummarizationProvider(SummarizationProvider):
    """OpenAI GPT implementation for summarization"""
    
    def __init__(self, client: AsyncOpenAI, model: str = "gpt-3.5-turbo"):
        self._client = client
        self._model = model
    
    async def summarize(
        self,
        transcript: str,
        transcription_id: UUID,
        language: str = "sw",
    ) -> Summary:
        """
        Summarize transcript text using OpenAI GPT
        
        Args:
            transcript: Transcript text to summarize
            transcription_id: ID of the transcription
            language: Language code (default: "sw" for Swahili)
        
        Returns:
            Summary entity with structured summary
        
        Raises:
            SummarizationProviderError: If summarization fails
        """
        try:
            logger.info(
                "Starting summarization",
                transcription_id=str(transcription_id),
                transcript_length=len(transcript),
                model=self._model,
            )
            
            # Format prompt with code-switching enhancement
            base_prompt = SWAHILI_SUMMARY_PROMPT_TEMPLATE.format(transcript=transcript)
            prompt = SwahiliProcessor.enhance_prompt_for_code_switching(
                base_prompt,
                transcript
            )
            
            # Call OpenAI API
            response = await self._client.chat.completions.create(
                model=self._model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that summarizes meetings in Swahili. Always respond with valid JSON only.",
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=0.3,
                response_format={"type": "json_object"},
            )
            
            # Parse response
            content = response.choices[0].message.content
            if not content:
                raise SummarizationProviderError("Empty response from OpenAI")
            
            # Parse JSON response
            try:
                summary_data = json.loads(content)
            except json.JSONDecodeError as e:
                logger.error(
                    "Failed to parse JSON response",
                    content=content[:200],  # Log first 200 chars
                    error=str(e),
                )
                raise SummarizationProviderError(
                    f"Invalid JSON response from OpenAI: {str(e)}"
                ) from e
            
            # Create Summary entity
            from uuid import uuid4
            summary = Summary(
                id=uuid4(),
                transcription_id=transcription_id,
                muhtasari=summary_data.get("muhtasari", ""),
                maamuzi=summary_data.get("maamuzi", []),
                kazi=[
                    ActionItem(
                        person=item.get("nani", ""),
                        task=item.get("kazi", ""),
                        due_date=item.get("tarehe"),
                    )
                    for item in summary_data.get("kazi", [])
                ],
                masuala_yaliyoahirishwa=summary_data.get("masuala_yaliyoahirishwa", []),
            )
            
            logger.info(
                "Summarization completed",
                transcription_id=str(transcription_id),
                summary_length=len(summary.muhtasari),
            )
            
            return summary
        
        except SummarizationProviderError:
            raise
        except Exception as e:
            logger.error(
                "Summarization failed",
                transcription_id=str(transcription_id),
                error=str(e),
                error_type=type(e).__name__,
            )
            raise SummarizationProviderError(
                f"Failed to summarize transcript: {str(e)}"
            ) from e

