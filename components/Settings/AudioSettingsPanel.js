import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';
import platformDetectionService from '../../services/platformDetectionService';

const getOutputIcon = (output) => {
  switch (output) {
    case 'HDMI': return 'cast';
    case 'Optique': return 'settings_input_hdmi';
    case 'Bluetooth': return 'bluetooth';
    case 'TV': return 'tv';
    default: return 'volume_up';
  }
};

const ToggleOption = ({ label, description, value, onToggle, isTV }) => {
  const ToggleButton = isTV ? TVFocusable : TouchableOpacity;
  
  return (
    <ToggleButton style={styles.toggleItem} onPress={onToggle} {...(isTV && {})}>
      <View style={styles.toggleTextContainer}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <View style={[styles.toggleSwitch, value && styles.toggleSwitchActive]}>
        <View style={[styles.toggleKnob, value && styles.toggleKnobActive]} />
      </View>
    </ToggleButton>
  );
};

ToggleOption.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  isTV: PropTypes.bool,
};

const AudioSettingsPanel = ({ onClose }) => {
  const isTV = platformDetectionService.shouldEnableTVFeatures();
  const [audioSettings, setAudioSettings] = useState({
    language: 'Français',
    audioTrack: 'Auto',
    volume: 100,
    output: 'HDMI',
    surround: false,
    audioDescription: false,
  });

  const languages = ['Français', 'English', 'Deutsch', 'Español', 'Italiano'];
  const audioTracks = ['Auto', 'Piste 1', 'Piste 2', 'Piste originale'];
  const outputs = ['HDMI', 'Optique', 'Bluetooth', 'TV'];

  const CloseButton = isTV ? TVFocusable : TouchableOpacity;
  const OptionButton = isTV ? TVFocusable : TouchableOpacity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Audio</Text>
        <CloseButton onPress={onClose} style={styles.closeButton} {...(isTV && { hasTVPreferredFocus: true })}>
          <Icon name="close" size={28} color={colors.text} />
        </CloseButton>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Langue audio</Text>
        
        <View style={styles.optionsContainer}>
          {languages.map((lang, index) => (
            <OptionButton
              key={lang}
              style={[styles.optionItem, audioSettings.language === lang && styles.optionItemSelected]}
              onPress={() => setAudioSettings({ ...audioSettings, language: lang })}
              {...(isTV && {
                nextFocusUp: index > 0 ? index - 1 : null,
                nextFocusDown: index < languages.length - 1 ? index + 1 : null,
                hasTVPreferredFocus: index === 0,
              })}
            >
              <Text style={[styles.optionText, audioSettings.language === lang && styles.optionTextSelected]}>
                {lang}
              </Text>
              {audioSettings.language === lang && (
                <Icon name="check" size={20} color={colors.primary} />
              )}
            </OptionButton>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Piste audio</Text>
        
        <View style={styles.optionsContainer}>
          {audioTracks.map((track, index) => (
            <OptionButton
              key={track}
              style={[styles.optionItem, audioSettings.audioTrack === track && styles.optionItemSelected]}
              onPress={() => setAudioSettings({ ...audioSettings, audioTrack: track })}
              {...(isTV && {
                nextFocusUp: index > 0 ? index - 1 : null,
                nextFocusDown: index < audioTracks.length - 1 ? index + 1 : null,
              })}
            >
              <Text style={[styles.optionText, audioSettings.audioTrack === track && styles.optionTextSelected]}>
                {track}
              </Text>
              {audioSettings.audioTrack === track && (
                <Icon name="check" size={20} color={colors.primary} />
              )}
            </OptionButton>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Sortie audio</Text>
        
        <View style={styles.optionsContainer}>
          {outputs.map((output, index) => (
            <OptionButton
              key={output}
              style={[styles.optionItem, audioSettings.output === output && styles.optionItemSelected]}
              onPress={() => setAudioSettings({ ...audioSettings, output })}
              {...(isTV && {
                nextFocusUp: index > 0 ? index - 1 : null,
                nextFocusDown: index < outputs.length - 1 ? index + 1 : null,
              })}
            >
              <Icon name={getOutputIcon(output)} size={20} color={audioSettings.output === output ? colors.primary : colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={[styles.optionText, audioSettings.output === output && styles.optionTextSelected]}>
                {output}
              </Text>
              {audioSettings.output === output && (
                <Icon name="check" size={20} color={colors.primary} />
              )}
            </OptionButton>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Options avancées</Text>
        
        <ToggleOption
          label="Son surround"
          description="Activer le son multi-canaux"
          value={audioSettings.surround}
          onToggle={() => setAudioSettings({ ...audioSettings, surround: !audioSettings.surround })}
          isTV={isTV}
        />
        
        <ToggleOption
          label="Audio description"
          description="Activer l'audio description pour malvoyants"
          value={audioSettings.audioDescription}
          onToggle={() => setAudioSettings({ ...audioSettings, audioDescription: !audioSettings.audioDescription })}
          isTV={isTV}
        />
      </ScrollView>
    </View>
  );
};

AudioSettingsPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 350,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderLeftWidth: 1,
    borderColor: colors.border,
    elevation: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceLight,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  optionsContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionItemSelected: {
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: colors.primary,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.text,
  },
  toggleKnobActive: {
    backgroundColor: '#000',
    transform: [{ translateX: 20 }],
  },
});

export default AudioSettingsPanel;
