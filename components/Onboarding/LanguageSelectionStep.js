import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';

const LANGUAGES = [
  { id: 'sango', name: 'Sango' },
  { id: 'french', name: 'Français' },
  { id: 'english', name: 'English' },
  { id: 'spanish', name: 'Español' },
];

const LanguageSelectionStep = ({ selectedLanguage, onSelect, onNext }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Icon name="language" size={64} color={colors.primary} />
          <Text style={styles.title}>Choisissez votre langue</Text>
          <Text style={styles.subtitle}>
            Sélectionnez la langue que vous souhaitez utiliser dans l&apos;application
          </Text>
        </View>

        <View style={styles.languageList}>
          {LANGUAGES.map((language, index) => (
            <TVFocusable
              key={language.id}
              style={[
                styles.languageItem,
                selectedLanguage === language.id && styles.languageItemSelected,
              ]}
              onPress={() => onSelect(language.id)}
              nextFocusUp={index > 0 ? index - 1 : index}
              nextFocusDown={index < LANGUAGES.length - 1 ? index + 1 : LANGUAGES.length}
              nextFocusRight={LANGUAGES.length}
              hasTVPreferredFocus={index === 0}
            >
              <Text style={[
                styles.languageName,
                selectedLanguage === language.id && styles.languageNameSelected,
              ]}>
                {language.name}
              </Text>
              {selectedLanguage === language.id && (
                <Icon name="check_circle" size={24} color={colors.primary} />
              )}
            </TVFocusable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TVFocusable
          style={[styles.continueButton, !selectedLanguage && styles.continueButtonDisabled]}
          onPress={onNext}
          disabled={!selectedLanguage}
          nextFocusUp={LANGUAGES.length - 1}
          nextFocusDown={null}
        >
          <Text style={styles.continueButtonText}>Continuer</Text>
          <Icon name="arrow_forward" size={24} color="#000" />
        </TVFocusable>
      </View>
    </View>
  );
};

LanguageSelectionStep.propTypes = {
  selectedLanguage: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  languageList: {
    gap: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageItemSelected: {
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    borderColor: colors.primary,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  languageNameSelected: {
    color: colors.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
  },
  continueButtonDisabled: {
    backgroundColor: colors.border,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 6,
  },
});

export default LanguageSelectionStep;
