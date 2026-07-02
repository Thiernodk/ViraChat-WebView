import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import Constants from 'expo-constants';
import TVFocusable from '../TVFocusable/TVFocusable';

const AboutItem = ({ label, value, icon }) => (
  <View style={styles.aboutItem}>
    <View style={styles.aboutIconContainer}>
      <Icon name={icon} size={20} color={colors.primary} />
    </View>
    <View style={styles.aboutTextContainer}>
      <Text style={styles.aboutLabel}>{label}</Text>
      <Text style={styles.aboutValue}>{value}</Text>
    </View>
  </View>
);

AboutItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

const TechBadge = ({ label }) => (
  <View style={styles.techBadge}>
    <Text style={styles.techBadgeText}>{label}</Text>
  </View>
);

TechBadge.propTypes = {
  label: PropTypes.string.isRequired,
};

const AboutSettingsPanel = ({ onClose }) => {
  const appInfo = {
    name: 'Limon+ TV Box',
    version: Constants.manifest?.version || '1.0.0',
    build: '2024.06.26',
    developer: 'Limon+ Team',
    license: 'Propriétaire',
    website: 'https://limontvbox.com',
  };

  const features = [
    'Lecture de flux IPTV locaux',
    'Support HLS, RTMP, UDP',
    'Guide EPG intégré',
    'Interface TV optimisée',
    'Gestion des favoris',
    'Recherche de chaînes',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>À propos</Text>
        <TVFocusable onPress={onClose} style={styles.closeButton} hasTVPreferredFocus={true}>
          <Icon name="close" size={28} color={colors.text} />
        </TVFocusable>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>L+</Text>
          </View>
          <Text style={styles.appName}>{appInfo.name}</Text>
          <Text style={styles.appVersion}>Version {appInfo.version}</Text>
        </View>

        <Text style={styles.sectionTitle}>Informations</Text>
        
        <AboutItem label="Version" value={appInfo.version} icon="info" />
        <AboutItem label="Build" value={appInfo.build} icon="build" />
        <AboutItem label="Développeur" value={appInfo.developer} icon="person" />
        <AboutItem label="Licence" value={appInfo.license} icon="verified_user" />

        <Text style={styles.sectionTitle}>Fonctionnalités</Text>
        
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Icon name="check_circle" size={16} color={colors.primary} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Technologies</Text>
        
        <View style={styles.techContainer}>
          <TechBadge label="React Native" />
          <TechBadge label="Expo" />
          <TechBadge label="HLS" />
        </View>

        <TVFocusable 
          style={styles.websiteButton}
          onPress={() => Linking.openURL(appInfo.website)}
        >
          <Icon name="language" size={20} color={colors.text} />
          <Text style={styles.websiteButtonText}>Visiter le site web</Text>
        </TVFocusable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 {appInfo.developer}. Tous droits réservés.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

AboutSettingsPanel.propTypes = {
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
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aboutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aboutTextContainer: {
    flex: 1,
  },
  aboutLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  featuresContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 8,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  techBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  techBadgeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  websiteButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});

export default AboutSettingsPanel;
