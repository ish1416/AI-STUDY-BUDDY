import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { generateQuiz } from '../services/aiService';
import { addPoints } from '../services/gamificationService';

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

  const nextQuestion = async () => {
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
      // Add points for completing quiz
      await addPoints(20, 'Quizzes');
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
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'normal', marginBottom: 20, color: '#000' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  loadingText: { fontSize: 18, color: '#000' },
  noteCard: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 0,
    marginVertical: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noteDate: { fontSize: 12, color: '#666', marginBottom: 8 },
  notePreview: { fontSize: 14, color: '#333', marginBottom: 15 },
  questionCounter: { fontSize: 16, color: '#000', marginBottom: 20 },
  questionText: { 
    fontSize: 18, 
    fontWeight: 'normal', 
    textAlign: 'left', 
    marginBottom: 30,
    color: '#000'
  },
  selectedText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'normal',
    marginTop: 15,
    textAlign: 'left',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  nextButton: {
    marginTop: 20
  },
  scoreText: { 
    fontSize: 32, 
    fontWeight: 'normal', 
    color: '#000', 
    marginBottom: 10 
  },
  percentageText: { 
    fontSize: 24, 
    color: '#666', 
    marginBottom: 30 
  },
  emptyText: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginTop: 50 
  }
});