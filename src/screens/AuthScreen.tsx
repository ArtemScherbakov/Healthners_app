import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Auth: undefined;
  Chat: undefined;
};

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export const AuthScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Healthner</Text>
      <Text style={styles.subtitle}>Welcome to our app!</Text>
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
          <Text style={styles.buttonText}>Get Started</Text>
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
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000000',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 