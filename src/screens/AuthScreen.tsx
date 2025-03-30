import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useApp, useTranslation } from '../context/AppContext';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export const AuthScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { isDarkMode } = useApp();
  const t = useTranslation();

  const handleEnterApp = async () => {
    try {
      // Генеруємо унікальний ID для користувача
      const userId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      await AsyncStorage.setItem('userToken', userId);
      navigation.replace('Chat');
    } catch (error) {
      console.error('Error saving user token:', error);
    }
  };

  const backgroundColor = isDarkMode ? '#000000' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const subtitleColor = isDarkMode ? '#CCCCCC' : '#666666';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image 
        source={isDarkMode ? require('../../assets/laptop-medical_dark.png') : require('../../assets/laptop-medical.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: textColor }]}>Healthners</Text>
      <Text style={[styles.subtitle, { color: subtitleColor }]}>{t.welcome}</Text>
      <TouchableOpacity 
        style={styles.buttonContainer}
        onPress={handleEnterApp}
      >
        <LinearGradient
          colors={['#4C6FFF', '#6C47FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>{t.getStarted}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: -35,
    marginTop: -130,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
}); 