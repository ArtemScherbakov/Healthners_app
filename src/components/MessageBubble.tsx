import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  isDarkMode: boolean;
}

export const MessageBubble = ({ text, isUser, isDarkMode }: MessageBubbleProps) => {
  const handleLinkPress = (url: string): boolean => {
    Linking.openURL(url).catch(err => console.error('Помилка відкриття посилання:', err));
    return true;
  };

  const textColor = isDarkMode 
    ? (isUser ? '#FFFFFF' : '#FFFFFF') 
    : (isUser ? '#FFFFFF' : '#000000');

  const markdownStyles = {
    body: {
      color: textColor,
      fontSize: 16,
      lineHeight: 24,
      flexShrink: 1,
    },
    paragraph: {
      color: textColor,
      fontSize: 16,
      lineHeight: 24,
      marginTop: 0,
      marginBottom: 0,
    },
    link: {
      color: isUser ? '#FFFFFF' : (isDarkMode ? '#0A84FF' : '#0066CC'),
      textDecorationLine: 'underline' as const,
    },
    list_item: {
      color: textColor,
      fontSize: 16,
      lineHeight: 24,
      marginTop: 4,
      marginBottom: 4,
      paddingLeft: 8,
    },
    bullet_list: {
      marginTop: 8,
      marginBottom: 8,
    },
  };

  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.botBubble,
        {
          backgroundColor: isDarkMode
            ? (isUser ? '#0A84FF' : '#1C1C1E')
            : (isUser ? '#007AFF' : '#F1F1F1')
        }
      ]}>
        <Markdown
          style={markdownStyles}
          onLinkPress={handleLinkPress}
        >
          {text}
        </Markdown>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  userContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  bubble: {
    minWidth: 40,
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexShrink: 1,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
}); 