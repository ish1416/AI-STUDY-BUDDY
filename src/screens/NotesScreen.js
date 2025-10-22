import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch (error) {
      console.error(error);
    }
  };

  const clearNotes = async () => {
    Alert.alert('Delete All Notes', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          await AsyncStorage.removeItem('notes');
          setNotes([]);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.noteCard}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Notes</Text>
      {notes.length > 0 ? (
        <>
          <FlatList
            data={notes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <CustomButton title="Clear All Notes" onPress={clearNotes} />
        </>
      ) : (
        <Text>No notes saved yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  noteCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
  },
  date: { fontSize: 12, color: 'gray', marginBottom: 5 },
  text: { fontSize: 16, color: '#333' },
});