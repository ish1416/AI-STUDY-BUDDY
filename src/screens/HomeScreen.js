import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to AI Study Buddy</Text>
      <Text style={styles.subtitle}>Your AI-powered learning assistant</Text>

      <CustomButton title="📷 Scan Notes" onPress={() => alert("Go to Scan Screen")} />
      <CustomButton title="📝 View Notes" onPress={() => alert("Go to Notes Screen")} />
      <CustomButton title="🎴 Flashcards" onPress={() => alert("Go to Flashcards Screen")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20 }
});
