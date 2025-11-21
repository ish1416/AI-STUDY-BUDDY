const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
const API_KEY = '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'; // Replace with your actual API key

export const summarizeText = async (text) => {
  try {
    if (!text || text.trim().length < 50) {
      throw new Error('Text too short for summarization');
    }

    console.log('Calling Hugging Face API...');
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 150,
          min_length: 30,
          do_sample: false
        }
      }),
    });

    console.log('API Response status:', response.status);
    const result = await response.json();
    console.log('API Response:', result);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${result.error || 'Unknown error'}`);
    }
    
    if (result.error) {
      throw new Error(result.error);
    }

    // Handle different response formats
    if (Array.isArray(result) && result[0]?.summary_text) {
      return result[0].summary_text;
    } else if (result.summary_text) {
      return result.summary_text;
    } else {
      throw new Error('Invalid API response format');
    }
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

    // Simple quiz generation logic for now
    const sentences = text.split('.').filter(s => s.trim().length > 20);
    const questions = [];

    for (let i = 0; i < Math.min(3, sentences.length); i++) {
      const sentence = sentences[i].trim();
      const words = sentence.split(' ');
      
      if (words.length > 5) {
        const keyWord = words[Math.floor(words.length / 2)];
        const question = sentence.replace(keyWord, '____');
        
        questions.push({
          id: i + 1,
          question: question + '?',
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
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw error;
  }
};