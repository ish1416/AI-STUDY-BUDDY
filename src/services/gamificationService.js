import AsyncStorage from '@react-native-async-storage/async-storage';

const GAMIFICATION_KEY = 'gamification_data';

export const getGamificationData = async () => {
  try {
    const data = await AsyncStorage.getItem(GAMIFICATION_KEY);
    return data ? JSON.parse(data) : {
      points: 0,
      streak: 0,
      lastStudyDate: null,
      totalNotes: 0,
      totalQuizzes: 0,
      totalFlashcards: 0,
      achievements: []
    };
  } catch (error) {
    console.error('Error loading gamification data:', error);
    return { points: 0, streak: 0, lastStudyDate: null, totalNotes: 0, totalQuizzes: 0, totalFlashcards: 0, achievements: [] };
  }
};

export const updateGamificationData = async (updates) => {
  try {
    const currentData = await getGamificationData();
    const newData = { ...currentData, ...updates };
    await AsyncStorage.setItem(GAMIFICATION_KEY, JSON.stringify(newData));
    return newData;
  } catch (error) {
    console.error('Error updating gamification data:', error);
  }
};

export const addPoints = async (points, activity) => {
  const data = await getGamificationData();
  const newPoints = data.points + points;
  
  console.log(`+${points} points for ${activity}!`);
  
  return await updateGamificationData({
    points: newPoints,
    [`total${activity}`]: (data[`total${activity}`] || 0) + 1
  });
};

export const updateStreak = async () => {
  const data = await getGamificationData();
  const today = new Date().toDateString();
  const lastStudy = data.lastStudyDate;
  
  let newStreak = data.streak;
  
  if (!lastStudy) {
    newStreak = 1;
  } else if (lastStudy !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastStudy === yesterday.toDateString()) {
      newStreak = data.streak + 1;
    } else {
      newStreak = 1;
    }
  }
  
  return await updateGamificationData({
    streak: newStreak,
    lastStudyDate: today
  });
};

export const checkAchievements = async (data) => {
  const achievements = [...data.achievements];
  
  const possibleAchievements = [
    { id: 'first_note', title: 'First Steps', description: 'Created your first note', condition: data.totalNotes >= 1 },
    { id: 'note_master', title: 'Note Master', description: 'Created 10 notes', condition: data.totalNotes >= 10 },
    { id: 'quiz_starter', title: 'Quiz Starter', description: 'Completed your first quiz', condition: data.totalQuizzes >= 1 },
    { id: 'quiz_expert', title: 'Quiz Expert', description: 'Completed 5 quizzes', condition: data.totalQuizzes >= 5 },
    { id: 'flashcard_fan', title: 'Flashcard Fan', description: 'Used flashcards for the first time', condition: data.totalFlashcards >= 1 },
    { id: 'streak_3', title: '3-Day Streak', description: 'Studied for 3 consecutive days', condition: data.streak >= 3 },
    { id: 'streak_7', title: 'Week Warrior', description: 'Studied for 7 consecutive days', condition: data.streak >= 7 },
    { id: 'points_100', title: 'Century Club', description: 'Earned 100 points', condition: data.points >= 100 },
    { id: 'points_500', title: 'Point Master', description: 'Earned 500 points', condition: data.points >= 500 }
  ];
  
  const newAchievements = possibleAchievements.filter(
    achievement => achievement.condition && !achievements.find(a => a.id === achievement.id)
  );
  
  if (newAchievements.length > 0) {
    achievements.push(...newAchievements);
    await updateGamificationData({ achievements });
    return newAchievements;
  }
  
  return [];
};