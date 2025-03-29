import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface QuickReplyButtonProps {
  text: string;
  onPress: () => void;
}

export const QuickReplyButton: React.FC<QuickReplyButtonProps> = ({ text, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text} numberOfLines={1}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#F1F1F1',
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
    fontSize: 15,
    textAlign: 'center',
  },
}); 