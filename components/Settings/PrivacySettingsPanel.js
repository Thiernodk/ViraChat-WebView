import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';

const ToggleOption = ({ label, description, value, onToggle }) => (
  <TVFocusable style={styles.toggleItem} onPress={onToggle}>
    <View style={styles.toggleTextContainer}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Text style={styles.toggleDescription}>{description}</Text>
    </View>
    <View style={[styles.toggleSwitch, value && styles.toggleSwitchActive]}>
      <View style={[styles.toggleKnob, value && styles.toggleKnobActive]} />
    </View>
  </TVFocusable>
);

ToggleOption.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const PrivacySettingsPanel = ({ onClose }) => {
  const [privacySettings, setPrivacySettings] = useState({
    lanChannelsDefault: true,
    shareAnalytics: false,
    localDataOnly: true,
    customPolicy: '',
  });

  const defaultPolicy = `Politique de Confidentialité - Chaînes LAN

Par défaut, Limon+ TV Box traite toutes les chaînes détectées sur le réseau local (LAN) comme des données privées.

1. Données locales uniquement
   - Les chaînes LAN ne sont jamais partagées avec des serveurs externes
   - Les métadonnées EPG restent sur votre appareil
   - Aucune télémétrie n'est envoyée pour les flux locaux

2. Stockage
   - Les configurations sont stockées localement
   - Les favoris et préférences restent privés
   - Historique de visionnage conservé localement

3. Réseau
   - Scan réseau limité au sous-réseau local
   - Aucune connexion externe pour les chaînes LAN
   - Multicast activé uniquement pour usage local

Vous pouvez modifier cette politique ci-dessous pour personnaliser le traitement de vos chaînes locales.`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Politique Confidentialité</Text>
        <TVFocusable onPress={onClose} style={styles.closeButton} hasTVPreferredFocus={true}>
          <Icon name="close" size={28} color={colors.text} />
        </TVFocusable>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.policyCard}>
          <View style={styles.policyHeader}>
            <Icon name="security" size={32} color={colors.primary} />
            <View style={styles.policyHeaderText}>
              <Text style={styles.policyTitle}>Chaînes LAN</Text>
              <Text style={styles.policySubtitle}>Politique par défaut</Text>
            </View>
          </View>
          
          <View style={styles.policyContent}>
            <Text style={styles.policyText}>{defaultPolicy}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Paramètres de confidentialité</Text>
        
        <ToggleOption
          label="Chaînes LAN privées par défaut"
          description="Traiter automatiquement les chaînes locales comme privées"
          value={privacySettings.lanChannelsDefault}
          onToggle={() => setPrivacySettings({ ...privacySettings, lanChannelsDefault: !privacySettings.lanChannelsDefault })}
        />
        
        <ToggleOption
          label="Données locales uniquement"
          description="Ne stocker aucune donnée sur des serveurs externes"
          value={privacySettings.localDataOnly}
          onToggle={() => setPrivacySettings({ ...privacySettings, localDataOnly: !privacySettings.localDataOnly })}
        />
        
        <ToggleOption
          label="Partager l'analyse anonyme"
          description="Aider à améliorer l'application avec des données anonymisées"
          value={privacySettings.shareAnalytics}
          onToggle={() => setPrivacySettings({ ...privacySettings, shareAnalytics: !privacySettings.shareAnalytics })}
        />

        <Text style={styles.sectionTitle}>Politique personnalisée</Text>
        
        <View style={styles.customPolicyContainer}>
          <Text style={styles.customPolicyLabel}>
            Modifiez la politique ci-dessous pour personnaliser le traitement de vos chaînes locales:
          </Text>
          <TextInput
            style={styles.customPolicyInput}
            multiline
            numberOfLines={8}
            value={privacySettings.customPolicy || defaultPolicy}
            onChangeText={(text) => setPrivacySettings({ ...privacySettings, customPolicy: text })}
            placeholder="Entrez votre politique personnalisée..."
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <TVFocusable style={styles.saveButton}>
          <Icon name="save" size={20} color={colors.text} />
          <Text style={styles.saveButtonText}>Enregistrer la politique</Text>
        </TVFocusable>

        <View style={styles.infoBox}>
          <Icon name="info" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Les modifications de la politique s&apos;appliquent uniquement aux chaînes détectées sur votre réseau local.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

PrivacySettingsPanel.propTypes = {
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
  policyCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  policyHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  policySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  policyContent: {
    padding: 16,
  },
  policyText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
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
  customPolicyContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  customPolicyLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  customPolicyInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  infoText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 16,
  },
});

export default PrivacySettingsPanel;
