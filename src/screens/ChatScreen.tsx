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

interface Message {
  text: string;
  isUser: boolean;
}

const quickReplies = [
  'Attention span',
  'Emotional stress',
  'Inactivity after continuous sitting',
  'Eye strain',
];

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

export const ChatScreen = () => {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello, I'm Healthner.\nWhat advice can I give you?", isUser: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

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
      const response = await geminiService.generateResponse(inputText);
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
      const response = await geminiService.generateResponse(text);
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
        { text: "Hello, I'm Healthners.\nWhat advice can I give you?", isUser: false },
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
      navigation.replace('Auth');
    } catch (error) {
      console.error('Error during logout:', error);
      navigation.replace('Auth');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTitles}>
          <Text style={styles.title}>Healthner</Text>
          <Text style={styles.subtitle}>Your virtual assistant</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={clearHistory} style={styles.headerButton}>
            <Ionicons name="trash-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
            <Ionicons name="log-out-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
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
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.bottomContainer}>
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
            />
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message Healthners"
            placeholderTextColor="#999999"
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
              color={inputText.trim() ? "#007AFF" : "#CCCCCC"}
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
    position: 'relative',
  },
  headerTitles: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
    position: 'absolute',
    right: 16,
    top: 8,
  },
  headerButton: {
    padding: 8,
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
    paddingVertical: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 22,
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