import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';
import platformDetectionService from '../../services/platformDetectionService';

const SettingsPanel = ({ onClose, onShowNetworkSettings, onShowSignalSettings, onShowAudioSettings, onShowAboutSettings, onShowPrivacySettings, onShowAccountSettings }) => {
  const isTV = platformDetectionService.shouldEnableTVFeatures();
  const sections = [
    { id: 'account', label: 'Compte', description: 'Gestion du compte', icon: 'person' },
    { id: 'network', label: 'Réseau', description: 'Connexion LAN', icon: 'wifi' },
    { id: 'signal', label: 'Signal', description: 'Chaînes disponibles', icon: 'signal_cellular_4_bar' },
    { id: 'audio', label: 'Audio', description: 'Langues audio', icon: 'volume_up' },
    { id: 'about', label: 'À propos', description: 'Version', icon: 'info' },
    { id: 'privacy', label: 'Confidentialité', description: 'Données privées', icon: 'security' },
  ];

  const handleSectionPress = (sectionId) => {
    if (sectionId === 'network' && onShowNetworkSettings) {
      onShowNetworkSettings();
    } else if (sectionId === 'signal' && onShowSignalSettings) {
      onShowSignalSettings();
    } else if (sectionId === 'audio' && onShowAudioSettings) {
      onShowAudioSettings();
    } else if (sectionId === 'about' && onShowAboutSettings) {
      onShowAboutSettings();
    } else if (sectionId === 'privacy' && onShowPrivacySettings) {
      onShowPrivacySettings();
    } else if (sectionId === 'account' && onShowAccountSettings) {
      onShowAccountSettings();
    }
  };

  const SectionButton = isTV ? TVFocusable : TouchableOpacity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
        <SectionButton onPress={onClose} style={styles.closeButton} {...(isTV && { hasTVPreferredFocus: true })}>
          <Icon name="close" size={28} color={colors.text} />
        </SectionButton>
      </View>
      
      <ScrollView style={styles.content}>
        {sections.map((section, index) => (
          <SectionButton
            key={section.id}
            style={styles.sectionItem}
            onPress={() => handleSectionPress(section.id)}
            {...(isTV && {
              nextFocusUp: index > 0 ? index - 1 : null,
              nextFocusDown: index < sections.length - 1 ? index + 1 : null,
              nextFocusLeft: null,
              nextFocusRight: null,
              hasTVPreferredFocus: index === 0,
            })}
          >
            <View style={styles.iconContainer}>
              <Icon name={section.icon} size={28} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionLabel}>{section.label}</Text>
              <Text style={styles.sectionDescription}>{section.description}</Text>
            </View>
            <Icon name="keyboard_arrow_right" size={24} color={colors.textTertiary} />
          </SectionButton>
        ))}
      </ScrollView>
    </View>
  );
};

SettingsPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  onShowNetworkSettings: PropTypes.func,
  onShowSignalSettings: PropTypes.func,
  onShowAudioSettings: PropTypes.func,
  onShowAboutSettings: PropTypes.func,
  onShowPrivacySettings: PropTypes.func,
  onShowAccountSettings: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 320,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderLeftWidth: 1,
    borderColor: colors.border,
    elevation: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceLight,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 6,
  },
  content: {
    flex: 1,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});

export default SettingsPanel;
