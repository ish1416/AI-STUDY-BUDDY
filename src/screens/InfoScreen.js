import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function InfoScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>About AI Study Buddy</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is AI Study Buddy?</Text>
          <Text style={styles.text}>
            AI Study Buddy is an intelligent learning companion designed to help students study more effectively. 
            It combines OCR technology, artificial intelligence, and gamification to create a comprehensive study platform.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>Smart OCR Scanning</Text>
            <Text style={styles.featureText}>
              Capture handwritten or printed notes with your camera and convert them to digital text instantly.
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureTitle}>AI-Powered Summaries</Text>
            <Text style={styles.featureText}>
              Generate concise summaries of your notes using advanced AI to help you review key concepts quickly.
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureTitle}>Automatic Quiz Generation</Text>
            <Text style={styles.featureText}>
              Create multiple-choice quizzes from your study material to test your understanding and retention.
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureTitle}>Interactive Flashcards</Text>
            <Text style={styles.featureText}>
              Study with digital flashcards that adapt to your learning pace and help reinforce important concepts.
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureTitle}>Progress Tracking</Text>
            <Text style={styles.featureText}>
              Monitor your study streaks, earn points, unlock achievements, and track your learning progress over time.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.text}>
            1. Scan your notes using the camera or select images from your gallery
          </Text>
          <Text style={styles.text}>
            2. Review and edit the extracted text as needed
          </Text>
          <Text style={styles.text}>
            3. Generate AI summaries to get key insights
          </Text>
          <Text style={styles.text}>
            4. Create quizzes and flashcards for active learning
          </Text>
          <Text style={styles.text}>
            5. Track your progress and maintain study streaks
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technology</Text>
          <Text style={styles.text}>
            Built with React Native for cross-platform compatibility, powered by OpenAI for intelligent text processing, 
            and Google Vision API for accurate text recognition.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <CustomButton 
          title="Get Started" 
          onPress={() => navigation.navigate('MainApp')}
        />
        <CustomButton 
          title="Back" 
          onPress={() => navigation.goBack()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'normal',
    color: '#000',
  },
  content: {
    padding: 30,
    paddingTop: 0,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'normal',
    color: '#000',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
  feature: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 30,
  },
});