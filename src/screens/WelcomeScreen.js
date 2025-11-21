import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Study Buddy</Text>
        <Text style={styles.subtitle}>Your intelligent learning companion</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Transform your study sessions with AI-powered tools that help you learn faster and retain more.
        </Text>
        
        <View style={styles.featureList}>
          <Text style={styles.feature}>• Scan and digitize handwritten notes</Text>
          <Text style={styles.feature}>• Generate AI summaries automatically</Text>
          <Text style={styles.feature}>• Create quizzes from your content</Text>
          <Text style={styles.feature}>• Study with interactive flashcards</Text>
          <Text style={styles.feature}>• Track progress with gamification</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <CustomButton 
          title="Get Started" 
          onPress={() => navigation.navigate('MainApp')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'normal',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  featureList: {
    backgroundColor: '#f9f9f9',
    padding: 25,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  feature: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
    lineHeight: 22,
  },
  footer: {
    marginBottom: 30,
  },
});