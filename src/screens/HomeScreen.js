import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getGamificationData } from '../services/gamificationService';
import CustomButton from '../components/CustomButton';

export default function HomeScreen() {
  const [stats, setStats] = useState({ points: 0, streak: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getGamificationData();
    setStats(data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to AI Study Buddy</Text>
      <Text style={styles.subtitle}>Your AI-powered learning assistant</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      <Text style={styles.welcomeMessage}>👋 Welcome back! Ready to boost your learning?</Text>
      
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>🚀 Your Learning Journey</Text>
        
        <View style={styles.featureRow}>
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>📷</Text>
            <Text style={styles.featureTitle}>Scan</Text>
            <Text style={styles.featureDesc}>Capture notes</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>📝</Text>
            <Text style={styles.featureTitle}>Notes</Text>
            <Text style={styles.featureDesc}>View & manage</Text>
          </View>
        </View>
        
        <View style={styles.featureRow}>
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🧠</Text>
            <Text style={styles.featureTitle}>Quiz</Text>
            <Text style={styles.featureDesc}>Test knowledge</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🎴</Text>
            <Text style={styles.featureTitle}>Cards</Text>
            <Text style={styles.featureDesc}>Study & review</Text>
          </View>
        </View>
      </View>

      <View style={styles.aboutContainer}>
        <Text style={styles.aboutTitle}>🧠 About AI Study Buddy</Text>
        <Text style={styles.aboutText}>AI Study Buddy is your intelligent learning companion that transforms the way you study:</Text>
        
        <Text style={styles.featureItem}>📸 <Text style={styles.featureBold}>Smart OCR:</Text> Scan handwritten or printed notes</Text>
        <Text style={styles.featureItem}>🤖 <Text style={styles.featureBold}>AI Summaries:</Text> Get concise summaries of your notes</Text>
        <Text style={styles.featureItem}>🧠 <Text style={styles.featureBold}>Auto Quizzes:</Text> Generate quizzes from your content</Text>
        <Text style={styles.featureItem}>🎴 <Text style={styles.featureBold}>Flashcards:</Text> Interactive study cards with animations</Text>
        <Text style={styles.featureItem}>🏆 <Text style={styles.featureBold}>Gamification:</Text> Earn points, maintain streaks, unlock achievements</Text>
        
        <Text style={styles.aboutFooter}>Study smarter, not harder! 🚀</Text>
      </View>
      
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionTitle}>📱 How to Navigate</Text>
        <Text style={styles.instructionText}>Use the bottom tabs to access different features:</Text>
        <Text style={styles.instructionText}>• Home - Overview and stats</Text>
        <Text style={styles.instructionText}>• Scan - Capture and process notes</Text>
        <Text style={styles.instructionText}>• Notes - View saved notes</Text>
        <Text style={styles.instructionText}>• Quiz - Test your knowledge</Text>
        <Text style={styles.instructionText}>• Flashcards - Study with cards</Text>
        <Text style={styles.instructionText}>• Profile - View progress and achievements</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'normal', marginBottom: 10, color: '#000' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 0,
    alignItems: 'center',
    flex: 0.48,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statNumber: { fontSize: 24, fontWeight: 'normal', color: '#000' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featuresTitle: { fontSize: 18, fontWeight: 'normal', marginBottom: 15, color: '#000' },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 0,
    alignItems: 'center',
    flex: 0.48,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  featureEmoji: { fontSize: 20, marginBottom: 8 },
  featureTitle: { fontSize: 14, fontWeight: 'normal', color: '#000', marginBottom: 4 },
  featureDesc: { fontSize: 12, color: '#666' },
  welcomeMessage: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'normal',
  },
  aboutContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 0,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  aboutTitle: { fontSize: 18, fontWeight: 'normal', marginBottom: 15, color: '#000' },
  aboutText: { fontSize: 14, color: '#666', marginBottom: 15 },
  featureItem: { fontSize: 14, color: '#666', marginBottom: 8 },
  featureBold: { fontWeight: 'normal', color: '#000' },
  aboutFooter: { fontSize: 14, color: '#000', marginTop: 10 },
  instructionContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 0,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  instructionTitle: { fontSize: 16, fontWeight: 'normal', marginBottom: 15, color: '#000' },
  instructionText: { fontSize: 14, color: '#666', marginBottom: 6 },
});
