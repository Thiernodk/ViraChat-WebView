import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';

const CountrySelectionStep = ({ selectedCountry, onSelect, onNext }) => {
  // For now, only Centrafrique is available
  // Architecture allows easy addition of more countries later
  const countries = [
    { id: 'centrafrique', name: 'Centrafrique', flag: '🇨🇫', code: 'CF' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Icon name="public" size={64} color={colors.primary} />
          <Text style={styles.title}>Sélectionnez votre pays</Text>
          <Text style={styles.subtitle}>
            Choisissez le pays où vous vous situez
          </Text>
        </View>

        <View style={styles.countryList}>
          {countries.map((country, index) => (
            <TVFocusable
              key={country.id}
              style={[
                styles.countryItem,
                selectedCountry === country.id && styles.countryItemSelected,
              ]}
              onPress={() => onSelect(country.id)}
              nextFocusUp={index > 0 ? index - 1 : index}
              nextFocusDown={index < countries.length - 1 ? index + 1 : countries.length}
              nextFocusRight={countries.length}
              hasTVPreferredFocus={index === 0}
            >
              <Text style={styles.flag}>{country.flag}</Text>
              <View style={styles.countryInfo}>
                <Text style={[
                  styles.countryName,
                  selectedCountry === country.id && styles.countryNameSelected,
                ]}>
                  {country.name}
                </Text>
                <Text style={styles.countryCode}>{country.code}</Text>
              </View>
              {selectedCountry === country.id && (
                <Icon name="check_circle" size={24} color={colors.primary} />
              )}
            </TVFocusable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TVFocusable
          style={[styles.continueButton, !selectedCountry && styles.continueButtonDisabled]}
          onPress={onNext}
          disabled={!selectedCountry}
          nextFocusUp={countries.length - 1}
          nextFocusDown={null}
        >
          <Text style={styles.continueButtonText}>Continuer</Text>
          <Icon name="arrow_forward" size={24} color="#000" />
        </TVFocusable>
      </View>
    </View>
  );
};

CountrySelectionStep.propTypes = {
  selectedCountry: PropTypes.string,
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
  countryList: {
    gap: 8,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  countryItemSelected: {
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    borderColor: colors.primary,
  },
  flag: {
    fontSize: 36,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  countryNameSelected: {
    color: colors.primary,
  },
  countryCode: {
    fontSize: 12,
    color: colors.textTertiary,
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

export default CountrySelectionStep;
