import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { summarizeText } from '../services/aiService';

export default function ScanScreen() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowImageOptions(true);
      setExtractedText('');
      setSummary('');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowImageOptions(true);
      setExtractedText('');
      setSummary('');
    }
  };

  const processImage = () => {
    setShowImageOptions(false);
    setLoading(true);
    
    // Simulate OCR processing (since Tesseract doesn't work in React Native)
    setTimeout(() => {
      const sampleText = "This is sample extracted text from your image. In a real implementation, this would be the actual text extracted from the image using a proper OCR service. You can edit this text below if needed.";
      setExtractedText(sampleText);
      setLoading(false);
    }, 2000);
  };

  const chooseAnotherImage = () => {
    setImage(null);
    setShowImageOptions(false);
    setExtractedText('');
    setSummary('');
  };

  const generateSummary = async () => {
    if (!extractedText) {
      Alert.alert('No Text', 'Please extract text first');
      return;
    }

    try {
      setSummarizing(true);
      const summaryText = await summarizeText(extractedText);
      setSummary(summaryText);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate summary. Using fallback method.');
      // Fallback summary generation
      const sentences = extractedText.split('.').slice(0, 3);
      setSummary(sentences.join('.') + '.');
    } finally {
      setSummarizing(false);
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
        summary: summary || '',
        date: new Date().toLocaleString(),
      };
      notes.push(newNote);
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      Alert.alert('Success', 'Note saved successfully!');
      setExtractedText('');
      setSummary('');
      setImage(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Scan Notes</Text>

      {!image && (
        <>
          <CustomButton title="📷 Take Photo" onPress={takePhoto} />
          <CustomButton title="🖼️ Select from Gallery" onPress={pickImage} />
        </>
      )}

      {image && (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          
          {showImageOptions && (
            <>
              <Text style={styles.imageStatus}>✅ Image selected</Text>
              <CustomButton title="✅ Use This Image" onPress={processImage} />
              <CustomButton title="🔄 Choose Another" onPress={chooseAnotherImage} />
            </>
          )}
        </>
      )}
      
      {loading && (
        <>
          <ActivityIndicator size="large" color="#6200EE" style={{ margin: 20 }} />
          <Text style={styles.loadingText}>Processing image...</Text>
        </>
      )}

      {extractedText && (
        <>
          <Text style={styles.sectionTitle}>📝 Extracted Text:</Text>
          <TextInput
            style={styles.textInput}
            multiline
            value={extractedText}
            onChangeText={setExtractedText}
            placeholder="Edit the extracted text here..."
          />
          <CustomButton title="🤖 Generate Summary" onPress={generateSummary} />
        </>
      )}

      {summarizing && (
        <>
          <ActivityIndicator size="large" color="#FF6B35" style={{ margin: 20 }} />
          <Text style={styles.loadingText}>Generating summary...</Text>
        </>
      )}
      
      {summary && (
        <>
          <Text style={styles.sectionTitle}>✨ AI Summary:</Text>
          <Text style={styles.summary}>{summary}</Text>
        </>
      )}

      {(extractedText || summary) && (
        <CustomButton title="💾 Save Note" onPress={saveNote} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  image: { width: 250, height: 250, marginVertical: 10, borderRadius: 10 },
  imageStatus: { fontSize: 14, color: 'green', marginBottom: 10 },
  loadingText: { fontSize: 16, color: '#6200EE', textAlign: 'center', marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#6200EE' },
  textInput: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 15, 
    fontSize: 16, 
    minHeight: 120, 
    width: '100%', 
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top'
  },
  summary: { marginTop: 10, fontSize: 16, color: '#FF6B35', fontStyle: 'italic', textAlign: 'left', paddingHorizontal: 10, backgroundColor: '#FFF8F0', padding: 15, borderRadius: 8 },
});