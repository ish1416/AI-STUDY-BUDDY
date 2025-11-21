import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.projectName}>AI Study Buddy</Text>
        <Text style={styles.title}>Smart Learning Assistant</Text>
        <Text style={styles.subtitle}>Transform your study sessions with AI</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Digitize notes, generate summaries, create quizzes, and track your progress with our intelligent study tools.
        </Text>
      </View>

      <View style={styles.footer}>
        <CustomButton 
          title="Get Started" 
          onPress={() => navigation.navigate('MainApp')}
        />
        <CustomButton 
          title="Learn More" 
          onPress={() => navigation.navigate('InfoScreen')}
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
    marginTop: 80,
  },
  projectName: {
    fontSize: 28,
    fontWeight: 'normal',
    color: '#000',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#333',
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
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 26,
  },
  footer: {
    marginBottom: 40,
  },
});