import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface QuickReplyButtonProps {
  text: string;
  onPress: () => void;
  isDarkMode: boolean;
}

export const QuickReplyButton = ({ text, onPress, isDarkMode }: QuickReplyButtonProps) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        { backgroundColor: isDarkMode ? '#1C1C1E' : '#F1F1F1' }
      ]} 
      onPress={onPress}
    >
      <Text 
        style={[
          styles.text,
          { color: isDarkMode ? '#FFFFFF' : '#000000' }
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginVertical: 4,
    minHeight: 36,
    flex: 1,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 