import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Animated, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { addPoints } from '../services/gamificationService';

export default function FlashcardsScreen() {
  const [notes, setNotes] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));
  const [studyMode, setStudyMode] = useState(false);

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

  const generateFlashcards = (note) => {
    const text = note.text;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const cards = [];

    // Generate Q&A pairs from sentences
    sentences.slice(0, 5).forEach((sentence, index) => {
      const words = sentence.trim().split(' ');
      if (words.length > 5) {
        const keyWords = words.filter(w => 
          w.length > 4 && 
          !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'these', 'those'].includes(w.toLowerCase())
        );
        
        if (keyWords.length > 0) {
          const keyWord = keyWords[0];
          const question = `What is ${keyWord.toLowerCase()}?`;
          const answer = sentence.trim();
          
          cards.push({
            id: index + 1,
            question: question,
            answer: answer
          });
        }
      }
    });

    // Add summary-based cards if available
    if (note.summary) {
      cards.push({
        id: cards.length + 1,
        question: "What is the main summary of this topic?",
        answer: note.summary
      });
    }

    // Add general comprehension cards
    cards.push({
      id: cards.length + 1,
      question: "What is the key concept discussed?",
      answer: text.substring(0, 150) + "..."
    });

    setFlashcards(cards);
    setCurrentCard(0);
    setIsFlipped(false);
    setStudyMode(true);
  };

  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const nextCard = async () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    } else {
      // Add points for completing flashcards
      await addPoints(15, 'Flashcards');
      Alert.alert('Complete!', 'You have reviewed all flashcards! Points earned!', [
        { text: 'Study Again', onPress: () => setCurrentCard(0) },
        { text: 'Back to Notes', onPress: () => setStudyMode(false) }
      ]);
    }
  };

  const previousCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  if (studyMode && flashcards.length > 0) {
    const card = flashcards[currentCard];
    
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Flashcards Study Mode</Text>
        <Text style={styles.cardCounter}>
          Card {currentCard + 1} of {flashcards.length}
        </Text>

        <TouchableOpacity onPress={flipCard} style={styles.cardContainer}>
          <Animated.View style={[styles.card, styles.cardFront, { transform: [{ rotateY: frontInterpolate }] }]}>
            <Text style={styles.cardLabel}>Question</Text>
            <Text style={styles.cardText}>{card.question}</Text>
            <Text style={styles.tapHint}>Tap to reveal answer</Text>
          </Animated.View>
          
          <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
            <Text style={styles.cardLabel}>Answer</Text>
            <Text style={styles.cardText}>{card.answer}</Text>
            <Text style={styles.tapHint}>Tap to see question</Text>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.navigationContainer}>
          <CustomButton 
            title="Previous" 
            onPress={previousCard}
            style={[styles.navButton, currentCard === 0 && styles.disabledButton]}
          />
          <CustomButton 
            title="Next" 
            onPress={nextCard}
            style={styles.navButton}
          />
        </View>

        <CustomButton 
          title="Back to Notes" 
          onPress={() => setStudyMode(false)}
          style={styles.backButton}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Flashcards</Text>
      <Text style={styles.subtitle}>Select a note to create flashcards</Text>
      
      {notes.length > 0 ? (
        notes.map((note) => (
          <View key={note.id} style={styles.noteCard}>
            <Text style={styles.noteDate}>{note.date}</Text>
            <Text style={styles.notePreview}>
              {note.text.substring(0, 100)}...
            </Text>
            <CustomButton
              title="Create Flashcards"
              onPress={() => generateFlashcards(note)}
            />
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>
          No notes available. Scan some notes first to create flashcards!
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#6200EE' },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20 },
  noteCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
  },
  noteDate: { fontSize: 12, color: 'gray', marginBottom: 5 },
  notePreview: { fontSize: 14, color: '#333', marginBottom: 10 },
  cardCounter: { fontSize: 16, color: '#6200EE', marginBottom: 20 },
  cardContainer: {
    width: 300,
    height: 200,
    marginVertical: 20,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: '#E3F2FD',
  },
  cardBack: {
    backgroundColor: '#FFF8E1',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    flex: 1,
  },
  tapHint: {
    fontSize: 12,
    color: 'gray',
    fontStyle: 'italic',
    marginTop: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  navButton: {
    flex: 0.45,
  },
  disabledButton: {
    opacity: 0.5,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#FF6B35',
  },
  emptyText: { 
    fontSize: 16, 
    color: 'gray', 
    textAlign: 'center', 
    marginTop: 50 
  }
});