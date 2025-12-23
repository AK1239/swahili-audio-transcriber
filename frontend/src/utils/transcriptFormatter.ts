/** Transcript text formatting utilities */

/**
 * Format transcript text into readable paragraphs
 * Splits long transcripts into sentences and groups them into logical paragraphs
 */
export function formatTranscriptText(text?: string): string {
  if (!text) return '';
  
  // Replace escaped newlines with actual newlines
  let cleaned = text.replace(/\\n/g, '\n').trim();
  
  // If already has multiple lines, use them
  if (cleaned.includes('\n') && cleaned.split('\n').length > 2) {
    return cleaned
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join('\n\n');
  }
  
  // Split into sentences by sentence boundaries
  // Handle periods, exclamation, question marks followed by space or end of string
  const sentences = cleaned
    .replace(/([.!?])\s+/g, '$1|SPLIT|')
    .replace(/([.!?])$/g, '$1|SPLIT|')
    .split('|SPLIT|')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length > 10); // Filter out very short fragments
  
  if (sentences.length === 0) return cleaned;
  
  // Group sentences into paragraphs
  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];
  

  const majorTopicShifters = /^(Bada ya hapo|Sasa|Lakini|Kwa hivyo|Na hivyo|Kwa nitaendelea)/i;
  
  // Calculate average sentence length to determine optimal paragraph size
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
  const minSentencesPerParagraph = 4; // Minimum sentences before considering a break
  const targetSentencesPerParagraph = avgSentenceLength < 50 ? 6 : 5; // More sentences if they're short
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    currentParagraph.push(sentence);
    
    // Calculate current paragraph length (in characters)
    const currentParagraphLength = currentParagraph.join(' ').length;
    const sentenceCount = currentParagraph.length;
    
    // Determine if we should start a new paragraph
    const isMajorTopicShifter = majorTopicShifters.test(sentence);
    const hasTargetSentences = sentenceCount >= targetSentencesPerParagraph;
    const hasMinSentences = sentenceCount >= minSentencesPerParagraph;
    const isLongParagraph = currentParagraphLength > 400; // Break if paragraph is getting too long
    const isMajorShiftWithEnoughContent = hasMinSentences && isMajorTopicShifter;
    const isLastSentence = i === sentences.length - 1;
    
    if (isLastSentence) {
      // Always break on last sentence
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(' '));
        currentParagraph = [];
      }
    } else if (isLongParagraph) {
      // Break on very long paragraphs
      paragraphs.push(currentParagraph.join(' '));
      currentParagraph = [];
    } else if (isMajorShiftWithEnoughContent) {
      // Break on major topic shifts only if we have minimum sentences
      paragraphs.push(currentParagraph.join(' '));
      currentParagraph = [];
    } else if (hasTargetSentences && currentParagraphLength > 300) {
      // Break if we have target sentences and good length
      paragraphs.push(currentParagraph.join(' '));
      currentParagraph = [];
    }
  }
  
  // If we still have sentences left, add them as a final paragraph
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(' '));
  }
  
  // Join paragraphs with double newlines for markdown
  return paragraphs.join('\n\n');
}

