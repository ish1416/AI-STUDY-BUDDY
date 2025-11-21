import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getGamificationData } from '../services/gamificationService';
import CustomButton from '../components/CustomButton';

export default function HomeScreen({ navigation }) {
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
        
        <CustomButton 
          title="📷 Scan Notes" 
          onPress={() => navigation.navigate('Scan')}
          style={styles.featureButton}
        />
        <CustomButton 
          title="📝 View Notes" 
          onPress={() => navigation.navigate('Notes')}
          style={styles.featureButton}
        />
        <CustomButton 
          title="🧠 Take Quiz" 
          onPress={() => navigation.navigate('Quiz')}
          style={styles.featureButton}
        />
        <CustomButton 
          title="🎴 Study Flashcards" 
          onPress={() => navigation.navigate('Flashcards')}
          style={styles.featureButton}
        />
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Study Tips</Text>
        <Text style={styles.tipText}>• Scan your handwritten notes for easy digitization</Text>
        <Text style={styles.tipText}>• Use AI summaries to quickly review key concepts</Text>
        <Text style={styles.tipText}>• Take quizzes to test your understanding</Text>
        <Text style={styles.tipText}>• Study flashcards for better retention</Text>
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
  tipsContainer: {
    backgroundColor: '#FFF8E1',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  tipsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#FF6B35' },
  tipText: { fontSize: 14, color: '#555', marginBottom: 5 },
});
