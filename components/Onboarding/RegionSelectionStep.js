import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';

const REGIONS = [
  { id: 'bangui', name: 'Bangui' },
  { id: 'mbaiki', name: 'Mbaïki' },
  { id: 'bouar', name: 'Bouar' },
  { id: 'damara', name: 'Damara' },
  { id: 'bossangoa', name: 'Bossangoa' },
  { id: 'yaloke', name: 'Yaloké' },
  { id: 'carnot', name: 'Carnot' },
  { id: 'berberati', name: 'Berbérati' },
  { id: 'nola', name: 'Nola' },
  { id: 'birao', name: 'Birao' },
  { id: 'boda', name: 'Boda' },
];

const RegionSelectionStep = ({ selectedRegion, onSelect, onNext }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Icon name="location_city" size={64} color={colors.primary} />
          <Text style={styles.title}>Sélectionnez votre ville ou votre région</Text>
          <Text style={styles.subtitle}>
            Choisissez votre zone géographique
          </Text>
        </View>

        <View style={styles.regionList}>
          {REGIONS.map((region, index) => (
            <TVFocusable
              key={region.id}
              style={[
                styles.regionItem,
                selectedRegion === region.id && styles.regionItemSelected,
              ]}
              onPress={() => onSelect(region.id)}
              nextFocusUp={index > 0 ? index - 1 : index}
              nextFocusDown={index < REGIONS.length - 1 ? index + 1 : REGIONS.length}
              nextFocusRight={REGIONS.length}
              hasTVPreferredFocus={index === 0}
            >
              <Icon 
                name="location_on" 
                size={20} 
                color={selectedRegion === region.id ? colors.primary : colors.textSecondary} 
              />
              <Text style={[
                styles.regionName,
                selectedRegion === region.id && styles.regionNameSelected,
              ]}>
                {region.name}
              </Text>
              {selectedRegion === region.id && (
                <Icon name="check_circle" size={24} color={colors.primary} />
              )}
            </TVFocusable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TVFocusable
          style={[styles.continueButton, !selectedRegion && styles.continueButtonDisabled]}
          onPress={onNext}
          disabled={!selectedRegion}
          nextFocusUp={REGIONS.length - 1}
          nextFocusDown={null}
        >
          <Text style={styles.continueButtonText}>Continuer</Text>
          <Icon name="arrow_forward" size={24} color="#000" />
        </TVFocusable>
      </View>
    </View>
  );
};

RegionSelectionStep.propTypes = {
  selectedRegion: PropTypes.string,
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
  regionList: {
    gap: 6,
  },
  regionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  regionItemSelected: {
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    borderColor: colors.primary,
  },
  regionName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  regionNameSelected: {
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

export default RegionSelectionStep;
