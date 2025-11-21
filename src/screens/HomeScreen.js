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

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Quick Actions</Text>
        
        <Text style={styles.welcomeMessage}>👋 Welcome back! Ready to boost your learning?</Text>
        
        <CustomButton 
          title="📷 Scan Notes" 
          onPress={() => console.log('Navigate to Scan - Use bottom tabs')}
          style={styles.featureButton}
        />
        <CustomButton 
          title="📝 View Notes" 
          onPress={() => console.log('Navigate to Notes - Use bottom tabs')}
          style={styles.featureButton}
        />
        <CustomButton 
          title="🧠 Take Quiz" 
          onPress={() => console.log('Navigate to Quiz - Use bottom tabs')}
          style={styles.featureButton}
        />
        <CustomButton 
          title="🎴 Study Flashcards" 
          onPress={() => console.log('Navigate to Flashcards - Use bottom tabs')}
          style={styles.featureButton}
        />
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
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#6200EE' },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20, textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 0.4,
  },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#6200EE' },
  statLabel: { fontSize: 12, color: 'gray' },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featuresTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  featureButton: { marginVertical: 5 },
  welcomeMessage: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  aboutContainer: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  aboutTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#2E7D32', textAlign: 'center' },
  aboutText: { fontSize: 14, color: '#555', marginBottom: 15, textAlign: 'center' },
  featureItem: { fontSize: 14, color: '#555', marginBottom: 8, lineHeight: 20 },
  featureBold: { fontWeight: 'bold', color: '#2E7D32' },
  aboutFooter: { fontSize: 16, color: '#4CAF50', textAlign: 'center', marginTop: 10, fontWeight: 'bold' },
  instructionContainer: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  instructionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#F57C00', textAlign: 'center' },
  instructionText: { fontSize: 13, color: '#555', marginBottom: 4 },
});
