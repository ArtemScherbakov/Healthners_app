import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isUser }) => {
  const handleLinkPress = (url: string): boolean => {
    Linking.openURL(url).catch(err => console.error('Помилка відкриття посилання:', err));
    return true;
  };

  const markdownStyles = {
    body: {
      ...styles.text,
      color: isUser ? '#FFFFFF' : '#000000',
    },
    link: {
      ...styles.link,
      color: isUser ? '#FFFFFF' : '#0066CC',
    },
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      <Markdown
        style={markdownStyles}
        onLinkPress={handleLinkPress}
      >
        {text}
      </Markdown>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 30,
    marginVertical: 6,
  },
  userContainer: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botContainer: {
    backgroundColor: '#F1F1F1',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
    color: '#000000',
  },
  link: {
    color: '#0066CC',
    textDecorationLine: 'underline',
  },
}); 