import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 0,
    marginVertical: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000'
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'normal'
  }
});
