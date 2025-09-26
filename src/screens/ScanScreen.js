import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Notes</Text>
      <CustomButton title="📷 Open Camera" onPress={() => alert("Camera feature coming soon")} />
      <CustomButton title="🖼 Upload Image" onPress={() => alert("Upload feature coming soon")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }
});

  