import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType {
  isDarkMode: boolean;
  language: 'uk' | 'en';
  toggleTheme: () => void;
  setLanguage: (lang: 'uk' | 'en') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const translations = {
  uk: {
    settings: 'Налаштування',
    language: 'Мова',
    theme: 'Тема',
    darkMode: 'Темна тема',
    lightMode: 'Світла тема',
    logout: 'Вийти',
    cancel: 'Скасувати',
    delete: 'Видалити',
    deleteHistory: 'Видалити історію',
    deleteHistoryConfirm: 'Ви впевнені, що хочете видалити всю історію чату? Це не можна буде скасувати.',
    getStarted: 'Розпочати',
    welcome: 'Ласкаво просимо!',
    messagePlaceholder: 'Напишіть повідомлення...',
    initialMessage: "Привіт, я Healthners.\nЯку пораду ви хотіли б отримати?",
    quickReplies: {
      attentionSpan: 'Концентрація уваги',
      emotionalStress: 'Емоційний стрес',
      inactivity: 'Малорухливість після тривалого сидіння',
      eyeStrain: 'Втома очей',
    }
  },
  en: {
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    logout: 'Log out',
    cancel: 'Cancel',
    delete: 'Delete',
    deleteHistory: 'Delete History',
    deleteHistoryConfirm: 'Are you sure you want to delete all chat history? This cannot be undone.',
    getStarted: 'Get Started',
    welcome: 'Welcome!',
    messagePlaceholder: 'Type a message...',
    initialMessage: "Hello, I'm Healthners.\nWhat advice would you like?",
    quickReplies: {
      attentionSpan: 'Attention span',
      emotionalStress: 'Emotional stress',
      inactivity: 'Inactivity after continuous sitting',
      eyeStrain: 'Eye strain',
    }
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'uk' | 'en'>('uk');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedLanguage = await AsyncStorage.getItem('language');
      
      if (savedTheme) setIsDarkMode(savedTheme === 'dark');
      if (savedLanguage) setLanguage(savedLanguage as 'uk' | 'en');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const changeLanguage = async (lang: 'uk' | 'en') => {
    try {
      setLanguage(lang);
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <AppContext.Provider 
      value={{ 
        isDarkMode, 
        language, 
        toggleTheme, 
        setLanguage: changeLanguage 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { language } = useApp();
  return translations[language];
}; 