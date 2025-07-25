interface SentimentResult {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
  keyPhrases: string[];
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Analyze the sentiment of the following financial text. Consider:
          - Overall tone
          - Key phrases indicating sentiment
          - Forward-looking statements
          - Risk disclosures
          Return a JSON object with score, label, confidence, and key phrases.`
      },
      {
        role: "user",
        content: text
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}