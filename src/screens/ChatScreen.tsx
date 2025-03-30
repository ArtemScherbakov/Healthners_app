import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuickReplyButton } from '../components/QuickReplyButton';
import { MessageBubble } from '../components/MessageBubble';
import { geminiService } from '../services/geminiService';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { SettingsMenu } from '../components/SettingsMenu';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useApp, useTranslation } from '../context/AppContext';

interface Message {
  text: string;
  isUser: boolean;
}

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

export const ChatScreen = () => {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const { isDarkMode } = useApp();
  const t = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { text: t.initialMessage, isUser: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const backgroundColor = isDarkMode ? '#000000' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const subtitleColor = isDarkMode ? '#CCCCCC' : '#666666';
  const borderColor = isDarkMode ? '#2C2C2E' : '#E5E5E5';
  const inputBgColor = isDarkMode ? '#1C1C1E' : '#F1F1F1';

  const quickReplies = [
    t.quickReplies.attentionSpan,
    t.quickReplies.emotionalStress,
    t.quickReplies.inactivity,
    t.quickReplies.eyeStrain,
  ];

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userToken');
        setUserId(id);
        if (id) {
          loadChatHistory(id);
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (messages.length === 1 && messages[0].isUser === false) {
      setMessages([{ text: t.initialMessage, isUser: false }]);
    }
  }, [t.initialMessage]);

  useEffect(() => {
    if (messages.length > 1 && userId) {
      saveChatHistory(userId);
    }
  }, [messages, userId]);

  const loadChatHistory = async (id: string) => {
    try {
      const savedMessages = await AsyncStorage.getItem(`chatHistory_${id}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (id: string) => {
    try {
      await AsyncStorage.setItem(`chatHistory_${id}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const response = await geminiService.generateResponse(inputText, userId!);
      const botMessage = { text: response, isUser: false };
      setMessages(prev => [...prev, botMessage]);

      // Зберігаємо оновлену історію
      const id = await AsyncStorage.getItem('userToken');
      if (id) {
        await AsyncStorage.setItem(`chatHistory_${id}`, JSON.stringify([...messages, userMessage, botMessage]));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleQuickReply = async (text: string) => {
    const userMessage = { text, isUser: true };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await geminiService.generateResponse(text, userId!);
      const botMessage = { text: response, isUser: false };
      setMessages(prev => [...prev, botMessage]);

      // Зберігаємо оновлену історію
      const id = await AsyncStorage.getItem('userToken');
      if (id) {
        await AsyncStorage.setItem(`chatHistory_${id}`, JSON.stringify([...messages, userMessage, botMessage]));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClearHistory = () => {
    setIsConfirmationVisible(true);
  };

  const clearHistory = async () => {
    try {
      const id = await AsyncStorage.getItem('userToken');
      if (!id) {
        console.log('No user ID found');
        return;
      }

      console.log('Clearing history for user:', id);
      await AsyncStorage.removeItem(`chatHistory_${id}`);
      
      setMessages([
        { text: t.initialMessage, isUser: false },
      ]);
      
      console.log('History cleared successfully');
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  const handleLogout = async () => {
    try {
      if (userId) {
        await AsyncStorage.removeItem(`chatHistory_${userId}`);
      }
      await AsyncStorage.removeItem('userToken');
      setIsSettingsVisible(false);
      navigation.replace('Auth');
    } catch (error) {
      console.error('Error during logout:', error);
      navigation.replace('Auth');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => setIsSettingsVisible(true)} 
            style={styles.headerButton}
          >
            <Ionicons name="menu-outline" size={24} color={isDarkMode ? '#007AFF' : '#007AFF'} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={[styles.title, { color: textColor }]}>Healthners</Text>
            <Text style={[styles.subtitle, { color: subtitleColor }]}>Your virtual assistant</Text>
          </View>
          <TouchableOpacity 
            onPress={handleClearHistory} 
            style={[styles.headerButton, styles.clearButton]}
          >
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <SettingsMenu 
        isVisible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        onLogout={handleLogout}
      />

      <ConfirmationModal
        isVisible={isConfirmationVisible}
        onClose={() => setIsConfirmationVisible(false)}
        onConfirm={clearHistory}
        title={t.deleteHistory}
        message={t.deleteHistoryConfirm}
      />

      <View style={[styles.contentContainer, { backgroundColor }]}>
        <ScrollView 
          style={styles.messagesContainer}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              text={message.text}
              isUser={message.isUser}
              isDarkMode={isDarkMode}
            />
          ))}
        </ScrollView>
      </View>

      <View style={[styles.bottomContainer, { borderTopColor: borderColor, backgroundColor }]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRepliesContainer}
        >
          {quickReplies.map((reply, index) => (
            <QuickReplyButton
              key={index}
              text={reply}
              onPress={() => handleQuickReply(reply)}
              isDarkMode={isDarkMode}
            />
          ))}
        </ScrollView>

        <View style={[styles.inputContainer, { borderTopColor: borderColor, backgroundColor }]}>
          <TextInput
            style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t.messagePlaceholder}
            placeholderTextColor={isDarkMode ? '#666666' : '#999999'}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={24}
              color={inputText.trim() ? "#007AFF" : isDarkMode ? '#666666' : '#CCCCCC'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  headerTitles: {
    flex: 1,
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  clearButton: {
    left: undefined,
    right: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 2,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  quickRepliesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 