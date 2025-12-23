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
        logger.info(
            "summarization.started",
            transcription_id=str(transcription_id),
            transcript_length=len(transcript),
            model=self._model,
        )
        
        # Warn if transcript is very short
        if len(transcript) < 100:
            logger.warning(
                "summarization.short_transcript",
                transcription_id=str(transcription_id),
                transcript_length=len(transcript),
                transcript_preview=transcript[:200],
            )
        
        try:
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
                        "content": """You are a helpful assistant that summarizes meetings in Swahili. 
Always respond with valid JSON only using this exact structure:
{
  "muhtasari": "string",
  "maamuzi": ["string"],
  "kazi": [{"nani": "string", "kazi": "string", "tarehe": "string or null"}],
  "masuala_yaliyoahirishwa": ["string"]
}
Use the exact field names as shown above.""",
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
                logger.error(
                    "summarization.empty_response",
                    transcription_id=str(transcription_id),
                )
                raise SummarizationProviderError("Empty response from OpenAI")
            
            # Parse JSON response
            try:
                summary_data = json.loads(content)
            except json.JSONDecodeError as e:
                # Log the raw response for debugging
                logger.error(
                    "summarization.invalid_json",
                    transcription_id=str(transcription_id),
                    raw_response=content[:500],  # First 500 chars
                    error=str(e),
                )
                raise SummarizationProviderError(
                    f"Invalid JSON response from OpenAI: {str(e)}"
                ) from e
            
        
            # Extract and validate data structure
            normalized_data = {
                "muhtasari": summary_data.get("muhtasari", ""),
                "maamuzi": summary_data.get("maamuzi", []),
                "kazi": summary_data.get("kazi", []),
                "masuala_yaliyoahirishwa": summary_data.get("masuala_yaliyoahirishwa", []),
            }
            
            # Validate array types
            if not isinstance(normalized_data["maamuzi"], list):
                normalized_data["maamuzi"] = []
            if not isinstance(normalized_data["kazi"], list):
                normalized_data["kazi"] = []
            if not isinstance(normalized_data["masuala_yaliyoahirishwa"], list):
                normalized_data["masuala_yaliyoahirishwa"] = []
            
            # Create Summary entity
            from uuid import uuid4
            summary = Summary(
                id=uuid4(),
                transcription_id=transcription_id,
                muhtasari=normalized_data.get("muhtasari") or "",
                maamuzi=normalized_data.get("maamuzi") or [],
                kazi=[
                    ActionItem(
                        person=item.get("nani", "") or "",
                        task=item.get("kazi", "") or "",
                        due_date=item.get("tarehe") or None,
                    )
                    for item in (normalized_data.get("kazi") or [])
                    if isinstance(item, dict)
                ],
                masuala_yaliyoahirishwa=normalized_data.get("masuala_yaliyoahirishwa") or [],
            )
            
            logger.info(
                "summarization.completed",
                transcription_id=str(transcription_id),
            )
            
            return summary
        
        except SummarizationProviderError:
            raise
        except Exception as e:
            raise SummarizationProviderError(
                f"Failed to summarize transcript: {str(e)}"
            ) from e

