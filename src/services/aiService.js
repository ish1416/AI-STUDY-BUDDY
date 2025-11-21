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

    console.log('Generating quiz from text...');
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const questions = [];
    const usedWords = new Set();

    // Generate different types of questions
    for (let i = 0; i < Math.min(5, sentences.length); i++) {
      const sentence = sentences[i].trim();
      const words = sentence.split(' ').filter(w => w.length > 3);
      
      if (words.length > 3) {
        // Find important words (nouns, verbs, adjectives)
        const importantWords = words.filter(word => 
          !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word.toLowerCase())
        );
        
        if (importantWords.length > 0) {
          const keyWord = importantWords[Math.floor(Math.random() * importantWords.length)];
          
          if (!usedWords.has(keyWord.toLowerCase())) {
            usedWords.add(keyWord.toLowerCase());
            
            const questionText = sentence.replace(new RegExp(keyWord, 'gi'), '____');
            const wrongOptions = generateWrongOptions(keyWord, text);
            
            const options = [keyWord, ...wrongOptions].sort(() => Math.random() - 0.5);
            const correctIndex = options.indexOf(keyWord);
            
            questions.push({
              id: i + 1,
              question: `Fill in the blank: ${questionText}`,
              options: options,
              correct: correctIndex
            });
          }
        }
      }
    }

    // Add some general comprehension questions
    if (questions.length < 3) {
      questions.push({
        id: questions.length + 1,
        question: 'What is the main topic discussed in this text?',
        options: ['Science', 'History', 'Mathematics', 'Literature'],
        correct: 0
      });
    }

    return questions.slice(0, 5); // Return max 5 questions
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw error;
  }
};

const generateWrongOptions = (correctWord, fullText) => {
  const words = fullText.split(/\s+/).filter(w => 
    w.length > 3 && 
    w.toLowerCase() !== correctWord.toLowerCase() &&
    !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(w.toLowerCase())
  );
  
  const uniqueWords = [...new Set(words.map(w => w.toLowerCase()))];
  const shuffled = uniqueWords.sort(() => Math.random() - 0.5);
  
  return shuffled.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1));
};