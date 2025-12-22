"""Swahili-specific text processing"""
import re
from typing import Set


class SwahiliProcessor:
    """Handles Swahili-specific text processing"""
    
    # Technical terms that should be preserved in English
    TECHNICAL_TERMS: Set[str] = {
        "deployment",
        "api",
        "database",
        "server",
        "frontend",
        "backend",
        "code",
        "git",
        "github",
        "docker",
        "kubernetes",
        "aws",
        "azure",
        "gcp",
        "http",
        "https",
        "json",
        "xml",
        "rest",
        "graphql",
        "sql",
        "nosql",
        "javascript",
        "typescript",
        "python",
        "java",
        "react",
        "vue",
        "angular",
        "node",
        "npm",
        "yarn",
        "package",
        "module",
        "framework",
        "library",
        "sdk",
        "cli",
        "ide",
        "vim",
        "vscode",
        "terminal",
        "command",
        "bash",
        "shell",
        "linux",
        "ubuntu",
        "windows",
        "macos",
        "ios",
        "android",
    }
    
    # Common proper nouns that should be preserved
    COMMON_PROPER_NOUNS: Set[str] = {
        "tanzania",
        "kenya",
        "uganda",
        "dar es salaam",
        "nairobi",
        "kampala",
        "dodoma",
        "arusha",
        "mwanza",
        "zanzibar",
    }
    
    @classmethod
    def preserve_technical_terms(cls, text: str) -> str:
        """
        Preserve English technical terms in Swahili text
        
        This method ensures that technical terms are not translated
        or modified during processing.
        
        Args:
            text: Text to process
        
        Returns:
            Processed text with technical terms preserved
        """
        # This is a placeholder for future implementation
        # In a real scenario, this would use NLP to identify
        # and preserve technical terms during translation/summarization
        
        # For now, we'll just return the text as-is
        # The actual preservation happens in the prompt instructions
        return text
    
    @classmethod
    def detect_code_switching(cls, text: str) -> bool:
        """
        Detect if text contains code-switching (Swahili + English)
        
        Args:
            text: Text to analyze
        
        Returns:
            True if code-switching is detected
        """
        # Simple heuristic: check for English words mixed with Swahili
        # This is a basic implementation
        
        # Common English words that might appear in Swahili text
        english_indicators = [
            r'\bthe\b',
            r'\bis\b',
            r'\bto\b',
            r'\bof\b',
            r'\band\b',
            r'\bin\b',
            r'\bfor\b',
            r'\bwith\b',
            r'\bon\b',
            r'\bat\b',
        ]
        
        text_lower = text.lower()
        english_count = sum(
            1 for pattern in english_indicators
            if re.search(pattern, text_lower, re.IGNORECASE)
        )
        
        # If we find multiple English words, likely code-switching
        return english_count >= 3
    
    @classmethod
    def extract_technical_terms(cls, text: str) -> Set[str]:
        """
        Extract technical terms from text
        
        Args:
            text: Text to analyze
        
        Returns:
            Set of technical terms found
        """
        text_lower = text.lower()
        found_terms = set()
        
        for term in cls.TECHNICAL_TERMS:
            # Check if term appears in text (as whole word)
            pattern = r'\b' + re.escape(term) + r'\b'
            if re.search(pattern, text_lower, re.IGNORECASE):
                found_terms.add(term)
        
        return found_terms
    
    @classmethod
    def enhance_prompt_for_code_switching(cls, base_prompt: str, text: str) -> str:
        """
        Enhance prompt with code-switching instructions if detected
        
        Args:
            base_prompt: Base prompt template
            text: Text to analyze
        
        Returns:
            Enhanced prompt
        """
        if cls.detect_code_switching(text):
            enhancement = (
                "\n\nMUHIMU: Nakala hii ina mchanganyiko wa Kiswahili na Kiingereza. "
                "Tafadhali weka istilahi za kiteknolojia na majina ya miradi kama yalivyo "
                "bila kuyabadilisha. Pia, weka maneno ya Kiingereza yaliyotumika kama yalivyo."
            )
            return base_prompt + enhancement
        
        return base_prompt

