import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Tesseract from 'tesseract.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';

export default function ScanScreen() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      runOCR(result.assets[0].uri);
    }
  };

  const runOCR = async (uri) => {
    try {
      setLoading(true);
      setExtractedText('');

      const { data: { text } } = await Tesseract.recognize(uri, 'eng');
      setExtractedText(text);
    } catch (error) {
      console.error(error);
      setExtractedText('Failed to extract text');
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    if (!extractedText) {
      Alert.alert('No Text', 'Please extract text first');
      return;
    }

    try {
      const existingNotes = await AsyncStorage.getItem('notes');
      const notes = existingNotes ? JSON.parse(existingNotes) : [];
      const newNote = {
        id: Date.now(),
        text: extractedText,
        date: new Date().toLocaleString(),
      };
      notes.push(newNote);
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      Alert.alert('Success', 'Note saved successfully!');
      setExtractedText('');
      setImage(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Scan Notes</Text>

      <CustomButton title="Upload Image" onPress={pickImage} />

      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading && <ActivityIndicator size="large" color="#6200EE" style={{ margin: 20 }} />}

      {extractedText ? <Text style={styles.result}>{extractedText}</Text> : null}

      <CustomButton title="Save Note" onPress={saveNote} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  image: { width: 250, height: 250, marginVertical: 20, borderRadius: 10 },
  result: { marginTop: 20, fontSize: 16, color: '#333' },
});