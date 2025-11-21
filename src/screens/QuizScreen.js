import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { generateQuiz } from '../services/aiService';

export default function QuizScreen() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const generateQuizFromNote = async (note) => {
    try {
      setLoading(true);
      setSelectedNote(note);
      console.log('Generating quiz from note:', note.text.substring(0, 100));
      
      const questions = await generateQuiz(note.text);
      setQuiz(questions);
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);
      
      console.log('Quiz generated with', questions.length, 'questions');
    } catch (error) {
      console.error('Quiz generation failed:', error);
      Alert.alert('Error', 'Failed to generate quiz. Please try another note.');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer === null) {
      Alert.alert('Please select an answer', 'Choose an option before proceeding.');
      return;
    }

    // Check if answer is correct
    if (selectedAnswer === quiz[currentQuestion].correct) {
      setScore(score + 1);
    }

    // Move to next question or show results
    if (currentQuestion + 1 < quiz.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const goBackToNotes = () => {
    setSelectedNote(null);
    setQuiz([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Generating quiz...</Text>
      </View>
    );
  }

  if (showResult) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Quiz Complete! 🎉</Text>
        <Text style={styles.scoreText}>
          Your Score: {score}/{quiz.length}
        </Text>
        <Text style={styles.percentageText}>
          {Math.round((score / quiz.length) * 100)}%
        </Text>
        
        <CustomButton title="🔄 Retake Quiz" onPress={restartQuiz} />
        <CustomButton title="📝 Choose Another Note" onPress={goBackToNotes} />
      </ScrollView>
    );
  }

  if (quiz.length > 0) {
    const question = quiz[currentQuestion];
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Quiz Mode</Text>
        <Text style={styles.questionCounter}>
          Question {currentQuestion + 1} of {quiz.length}
        </Text>
        
        <Text style={styles.questionText}>{question.question}</Text>
        
        {question.options.map((option, index) => (
          <CustomButton
            key={index}
            title={`${String.fromCharCode(65 + index)}. ${option}`}
            onPress={() => {
              console.log('Selected answer:', index);
              selectAnswer(index);
            }}
          />
        ))}
        
        {selectedAnswer !== null && (
          <Text style={styles.selectedText}>
            Selected: {String.fromCharCode(65 + selectedAnswer)}. {question.options[selectedAnswer]}
          </Text>
        )}
        
        <CustomButton 
          title={currentQuestion + 1 === quiz.length ? "Finish Quiz" : "Next Question"}
          onPress={nextQuestion}
          style={styles.nextButton}
        />
        
        <CustomButton title="← Back to Notes" onPress={goBackToNotes} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Generate Quiz</Text>
      <Text style={styles.subtitle}>Select a note to create a quiz</Text>
      
      {notes.length > 0 ? (
        notes.map((note) => (
          <View key={note.id} style={styles.noteCard}>
            <Text style={styles.noteDate}>{note.date}</Text>
            <Text style={styles.notePreview}>
              {note.text.substring(0, 100)}...
            </Text>
            <CustomButton
              title="📝 Generate Quiz"
              onPress={() => generateQuizFromNote(note)}
            />
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>
          No notes available. Scan some notes first to generate quizzes!
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#6200EE' },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20 },
  loadingText: { fontSize: 18, color: '#6200EE' },
  noteCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
  },
  noteDate: { fontSize: 12, color: 'gray', marginBottom: 5 },
  notePreview: { fontSize: 14, color: '#333', marginBottom: 10 },
  questionCounter: { fontSize: 16, color: '#6200EE', marginBottom: 20 },
  questionText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 30,
    color: '#333'
  },
  selectedText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center'
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50'
  },
  scoreText: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#4CAF50', 
    marginBottom: 10 
  },
  percentageText: { 
    fontSize: 24, 
    color: '#FF6B35', 
    marginBottom: 30 
  },
  emptyText: { 
    fontSize: 16, 
    color: 'gray', 
    textAlign: 'center', 
    marginTop: 50 
  }
});