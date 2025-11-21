import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import NotesScreen from './src/screens/NotesScreen';
import QuizScreen from './src/screens/QuizScreen';
import FlashcardsScreen from './src/screens/FlashcardsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarStyle: { backgroundColor: '#f5f5f5' },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Scan') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Notes') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            } else if (route.name === 'Quiz') {
              iconName = focused ? 'help-circle' : 'help-circle-outline';
            } else if (route.name === 'Flashcards') {
              iconName = focused ? 'albums' : 'albums-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200EE',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Scan" component={ScanScreen} />
        <Tab.Screen name="Notes" component={NotesScreen} />
        <Tab.Screen name="Quiz" component={QuizScreen} />
        <Tab.Screen name="Flashcards" component={FlashcardsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


