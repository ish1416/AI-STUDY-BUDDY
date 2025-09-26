import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function FlashcardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcards</Text>
      <CustomButton title="➕ Add Flashcards" onPress={() => alert("Flashcards feature coming soon")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }
});
