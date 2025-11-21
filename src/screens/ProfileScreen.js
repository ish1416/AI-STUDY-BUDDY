import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { getGamificationData, updateStreak, checkAchievements } from '../services/gamificationService';
import CustomButton from '../components/CustomButton';

export default function ProfileScreen() {
  const [gamificationData, setGamificationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      const data = await getGamificationData();
      setGamificationData(data);
      
      // Update streak when profile is viewed
      const updatedData = await updateStreak();
      const newAchievements = await checkAchievements(updatedData);
      
      if (newAchievements.length > 0) {
        Alert.alert(
          '🎉 New Achievement!',
          newAchievements.map(a => `${a.title}: ${a.description}`).join('\n')
        );
      }
      
      setGamificationData(updatedData);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 7) return '🔥🔥';
    if (streak >= 3) return '🔥';
    return '📚';
  };

  const getPointsLevel = (points) => {
    if (points >= 1000) return { level: 'Master', emoji: '👑' };
    if (points >= 500) return { level: 'Expert', emoji: '🏆' };
    if (points >= 100) return { level: 'Advanced', emoji: '⭐' };
    if (points >= 50) return { level: 'Intermediate', emoji: '📈' };
    return { level: 'Beginner', emoji: '🌱' };
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const { level, emoji } = getPointsLevel(gamificationData.points);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>{getStreakEmoji(gamificationData.streak)}</Text>
          <Text style={styles.statNumber}>{gamificationData.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>{emoji}</Text>
          <Text style={styles.statNumber}>{gamificationData.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>
      
      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>Level: {level}</Text>
      </View>
      
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Study Activity</Text>
        <Text style={styles.activityText}>📝 Notes Created: {gamificationData.totalNotes || 0}</Text>
        <Text style={styles.activityText}>🧠 Quizzes Completed: {gamificationData.totalQuizzes || 0}</Text>
        <Text style={styles.activityText}>🎴 Flashcards Studied: {gamificationData.totalFlashcards || 0}</Text>
      </View>
      
      {gamificationData.achievements && gamificationData.achievements.length > 0 && (
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          {gamificationData.achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDesc}>{achievement.description}</Text>
            </View>
          ))}
        </View>
      )}
      
      <CustomButton 
        title="🔄 Refresh Stats" 
        onPress={loadGamificationData}
        style={styles.refreshButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#6200EE' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    flex: 0.45,
  },
  statEmoji: { fontSize: 30, marginBottom: 10 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#6200EE' },
  statLabel: { fontSize: 14, color: 'gray' },
  levelContainer: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  levelText: { fontSize: 18, fontWeight: 'bold', color: '#6200EE' },
  activityContainer: {
    backgroundColor: '#FFF8E1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  activityText: { fontSize: 16, marginBottom: 5, color: '#555' },
  achievementsContainer: {
    backgroundColor: '#F3E5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  achievementCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  achievementTitle: { fontSize: 16, fontWeight: 'bold', color: '#6200EE' },
  achievementDesc: { fontSize: 14, color: 'gray' },
  refreshButton: { backgroundColor: '#4CAF50' },
});
