import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, useTranslation } from '../context/AppContext';

interface SettingsMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const SettingsMenu = ({ isVisible, onClose, onLogout }: SettingsMenuProps) => {
  const { isDarkMode, toggleTheme, language, setLanguage } = useApp();
  const t = useTranslation();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const menuItems = [
    {
      title: t.language,
      icon: 'globe-outline',
      rightContent: (
        <View style={styles.languageButtons}>
          <TouchableOpacity 
            style={[
              styles.langButton,
              language === 'uk' && styles.langButtonActive
            ]}
            onPress={() => setLanguage('uk')}
          >
            <Text style={[
              styles.langButtonText,
              language === 'uk' && styles.langButtonTextActive
            ]}>UA</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.langButton,
              language === 'en' && styles.langButtonActive
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[
              styles.langButtonText,
              language === 'en' && styles.langButtonTextActive
            ]}>EN</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      title: t.theme,
      icon: isDarkMode ? 'moon-outline' : 'sunny-outline',
      rightContent: (
        <TouchableOpacity 
          style={styles.themeSwitch}
          onPress={toggleTheme}
        >
          <Ionicons 
            name={isDarkMode ? 'moon' : 'sunny'} 
            size={24} 
            color={isDarkMode ? '#007AFF' : '#FFB800'}
          />
        </TouchableOpacity>
      ),
    },
  ];

  const backgroundColor = isDarkMode ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const borderColor = isDarkMode ? '#2C2C2E' : '#F0F0F0';

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          styles.modalOverlay,
          {
            opacity: fadeAnim,
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)',
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.menuContainer,
            {
              transform: [{ translateX: slideAnim }],
              backgroundColor,
            }
          ]}
        >
          <View style={[styles.header, { borderBottomColor: borderColor }]}>
            <Text style={[styles.headerTitle, { color: textColor }]}>{t.settings}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>
          
          {menuItems.map((item, index) => (
            <View 
              key={index} 
              style={[styles.menuItem, { borderBottomColor: borderColor }]}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name={item.icon as any} size={24} color={textColor} />
                <Text style={[styles.menuItemText, { color: textColor }]}>{item.title}</Text>
              </View>
              {item.rightContent}
            </View>
          ))}

          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutButton, { borderTopColor: borderColor }]} 
            onPress={onLogout}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              <Text style={[styles.menuItemText, styles.logoutText]}>{t.logout}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  menuContainer: {
    width: '80%',
    maxWidth: 300,
    height: '100%',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  menuItemText: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF3B30',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F1F1F1',
  },
  langButtonActive: {
    backgroundColor: '#007AFF',
  },
  langButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  langButtonTextActive: {
    color: '#FFFFFF',
  },
  themeSwitch: {
    padding: 8,
  },
}); 