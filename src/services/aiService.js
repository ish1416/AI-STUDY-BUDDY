import { OPENAI_API_KEY } from '@env';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const summarizeText = async (text) => {
  try {
    if (!text || text.trim().length < 50) {
      throw new Error('Text too short for summarization');
    }

    console.log('Calling OpenAI API...');
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise summaries of study material. Keep summaries under 150 words and focus on key concepts.'
          },
          {
            role: 'user',
            content: `Please summarize this text: ${text}`
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      }),
    });

    console.log('API Response status:', response.status);
    const result = await response.json();
    console.log('API Response:', result);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${result.error?.message || 'Unknown error'}`);
    }
    
    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.choices[0]?.message?.content || 'Summary not available';
  } catch (error) {
    console.error('Summarization error:', error);
    throw error;
  }
};

export const generateQuiz = async (text) => {
  try {
    if (!text || text.trim().length < 100) {
      throw new Error('Text too short for quiz generation');
    }

    console.log('Generating quiz with OpenAI...');
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a quiz generator. Create exactly 3-5 multiple choice questions based on the given text. Return ONLY a JSON array with this format: [{"id": 1, "question": "question text", "options": ["A", "B", "C", "D"], "correct": 0}]. The correct field should be the index (0-3) of the correct answer.'
          },
          {
            role: 'user',
            content: `Generate quiz questions from this text: ${text}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const content = result.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No quiz content generated');
    }

    try {
      const questions = JSON.parse(content);
      return Array.isArray(questions) ? questions : [questions];
    } catch (parseError) {
      console.log('Failed to parse OpenAI response, using fallback');
      return generateFallbackQuiz(text);
    }
  } catch (error) {
    console.error('Quiz generation error:', error);
    return generateFallbackQuiz(text);
  }
};

const generateFallbackQuiz = (text) => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const questions = [];
  
  for (let i = 0; i < Math.min(3, sentences.length); i++) {
    const sentence = sentences[i].trim();
    const words = sentence.split(' ').filter(w => w.length > 4);
    
    if (words.length > 0) {
      const keyWord = words[Math.floor(Math.random() * words.length)];
      const questionText = sentence.replace(keyWord, '____');
      
      questions.push({
        id: i + 1,
        question: `Fill in the blank: ${questionText}`,
        options: [keyWord, 'Option B', 'Option C', 'Option D'],
        correct: 0
      });
    }
  }
  
  return questions.length > 0 ? questions : [
    {
      id: 1,
      question: 'What is the main topic of this text?',
      options: ['Topic A', 'Topic B', 'Topic C', 'Topic D'],
      correct: 0
    }
  ];
};