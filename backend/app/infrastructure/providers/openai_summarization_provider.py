"""OpenAI GPT summarization provider"""
import json
from uuid import UUID

from openai import AsyncOpenAI

from app.domain.entities.summary import ActionItem, Summary
from app.domain.exceptions.validation_exceptions import SummarizationProviderError
from app.domain.interfaces.summarization_provider import SummarizationProvider
from app.application.services.swahili_processor import SwahiliProcessor
from app.infrastructure.providers.prompts import get_system_prompt, get_user_prompt_template
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
            language=language,
        )
        
        # Log transcript preview for debugging (first 500 chars)
        logger.info(
            "summarization.transcript_preview",
            transcription_id=str(transcription_id),
            transcript_preview=transcript[:500] if transcript else "EMPTY",
            transcript_is_empty=not transcript or len(transcript.strip()) == 0,
        )
        
        # Warn if transcript is very short or empty
        if not transcript or len(transcript.strip()) == 0:
            logger.error(
                "summarization.empty_transcript",
                transcription_id=str(transcription_id),
            )
            raise SummarizationProviderError("Cannot summarize empty transcript")
        
        if len(transcript) < 100:
            logger.warning(
                "summarization.short_transcript",
                transcription_id=str(transcription_id),
                transcript_length=len(transcript),
                transcript_preview=transcript[:200],
            )
        
        try:
            # Get language-aware prompts
            system_prompt = get_system_prompt(language)
            user_prompt_template = get_user_prompt_template(language)
            
            # Format user prompt with transcript
            user_prompt = user_prompt_template.format(transcript=transcript)
            
            # Log full prompt length to ensure transcript is included
            logger.info(
                "summarization.prompt_prepared",
                transcription_id=str(transcription_id),
                user_prompt_length=len(user_prompt),
                transcript_length=len(transcript),
                transcript_in_prompt=transcript[:100] in user_prompt if transcript else False,
            )
            
            # Enhance for code-switching awareness (only for Swahili)
            if language.lower() == "sw":
                user_prompt = SwahiliProcessor.enhance_prompt_for_code_switching(
                    user_prompt,
                    transcript
                )
            
            # Call OpenAI API with improved prompt structure
            response = await self._client.chat.completions.create(
                model=self._model,
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {
                        "role": "user",
                        "content": user_prompt,
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
            
            # Log raw API response for debugging (full content)
            logger.info(
                "summarization.raw_response",
                transcription_id=str(transcription_id),
                raw_response=content,
                response_length=len(content),
            )
            
            # Parse JSON response
            try:
                summary_data = json.loads(content)
                # Log parsed JSON structure for debugging
                logger.info(
                    "summarization.parsed_json",
                    transcription_id=str(transcription_id),
                    json_keys=list(summary_data.keys()) if isinstance(summary_data, dict) else "not_a_dict",
                    muhtasari_present="muhtasari" in summary_data if isinstance(summary_data, dict) else False,
                    maamuzi_present="maamuzi" in summary_data if isinstance(summary_data, dict) else False,
                    kazi_present="kazi" in summary_data if isinstance(summary_data, dict) else False,
                    masuala_present="masuala_yaliyoahirishwa" in summary_data if isinstance(summary_data, dict) else False,
                    maamuzi_type=type(summary_data.get("maamuzi")).__name__ if isinstance(summary_data, dict) else "N/A",
                    kazi_type=type(summary_data.get("kazi")).__name__ if isinstance(summary_data, dict) else "N/A",
                    masuala_type=type(summary_data.get("masuala_yaliyoahirishwa")).__name__ if isinstance(summary_data, dict) else "N/A",
                    maamuzi_value=summary_data.get("maamuzi") if isinstance(summary_data, dict) else "N/A",
                    kazi_value=summary_data.get("kazi") if isinstance(summary_data, dict) else "N/A",
                    masuala_value=summary_data.get("masuala_yaliyoahirishwa") if isinstance(summary_data, dict) else "N/A",
                )
            except json.JSONDecodeError as e:
                # Log the raw response for debugging
                logger.error(
                    "summarization.invalid_json",
                    transcription_id=str(transcription_id),
                    raw_response=content[:1000],  # First 1000 chars for better debugging
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
            
            # Log normalized data before validation
            logger.info(
                "summarization.before_validation",
                transcription_id=str(transcription_id),
                muhtasari_length=len(normalized_data.get("muhtasari", "")),
                maamuzi_count=len(normalized_data.get("maamuzi", [])) if isinstance(normalized_data.get("maamuzi"), list) else "not_list",
                kazi_count=len(normalized_data.get("kazi", [])) if isinstance(normalized_data.get("kazi"), list) else "not_list",
                masuala_count=len(normalized_data.get("masuala_yaliyoahirishwa", [])) if isinstance(normalized_data.get("masuala_yaliyoahirishwa"), list) else "not_list",
                maamuzi_sample=normalized_data.get("maamuzi", [])[:3] if isinstance(normalized_data.get("maamuzi"), list) else normalized_data.get("maamuzi"),
                kazi_sample=normalized_data.get("kazi", [])[:3] if isinstance(normalized_data.get("kazi"), list) else normalized_data.get("kazi"),
            )
            
            # Validate array types
            if not isinstance(normalized_data["maamuzi"], list):
                logger.warning(
                    "summarization.maamuzi_not_list",
                    transcription_id=str(transcription_id),
                    actual_type=type(normalized_data["maamuzi"]).__name__,
                    value=normalized_data["maamuzi"],
                )
                normalized_data["maamuzi"] = []
            if not isinstance(normalized_data["kazi"], list):
                logger.warning(
                    "summarization.kazi_not_list",
                    transcription_id=str(transcription_id),
                    actual_type=type(normalized_data["kazi"]).__name__,
                    value=normalized_data["kazi"],
                )
                normalized_data["kazi"] = []
            if not isinstance(normalized_data["masuala_yaliyoahirishwa"], list):
                logger.warning(
                    "summarization.masuala_not_list",
                    transcription_id=str(transcription_id),
                    actual_type=type(normalized_data["masuala_yaliyoahirishwa"]).__name__,
                    value=normalized_data["masuala_yaliyoahirishwa"],
                )
                normalized_data["masuala_yaliyoahirishwa"] = []
            
            # Log after validation
            logger.info(
                "summarization.after_validation",
                transcription_id=str(transcription_id),
                maamuzi_final_count=len(normalized_data["maamuzi"]),
                kazi_final_count=len(normalized_data["kazi"]),
                masuala_final_count=len(normalized_data["masuala_yaliyoahirishwa"]),
            )
            
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

