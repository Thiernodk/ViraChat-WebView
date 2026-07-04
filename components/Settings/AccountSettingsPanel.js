import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import onboardingService from '../../services/onboardingService';
import TVFocusable from '../TVFocusable/TVFocusable';
import platformDetectionService from '../../services/platformDetectionService';

const AccountItem = ({ label, value, icon }) => (
  <View style={styles.accountItem}>
    <View style={styles.accountIconContainer}>
      <Icon name={icon} size={20} color={colors.primary} />
    </View>
    <View style={styles.accountTextContainer}>
      <Text style={styles.accountLabel}>{label}</Text>
      <Text style={styles.accountValue}>{value}</Text>
    </View>
  </View>
);

AccountItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

const AccountSettingsPanel = ({ onClose, onShowLanguageSettings, onShowRegionSettings }) => {
  const isTV = platformDetectionService.shouldEnableTVFeatures();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await onboardingService.getUserData();
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ? Cela effacera toutes vos données locales.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            await onboardingService.clearOnboardingData();
            Alert.alert(
              'Déconnexion réussie',
              'Veuillez redémarrer l\'application pour effectuer un nouvel onboarding.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const handleChangeAccount = () => {
    Alert.alert(
      'Changer de compte',
      'Cela effacera vos données actuelles. Voulez-vous continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Continuer',
          style: 'destructive',
          onPress: async () => {
            await onboardingService.clearOnboardingData();
            Alert.alert(
              'Compte réinitialisé',
              'Veuillez redémarrer l\'application pour vous connecter avec un nouveau compte.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Compte Limon+ TV</Text>
          {(() => {
            const CloseButton = isTV ? TVFocusable : TouchableOpacity;
            return (
              <CloseButton onPress={onClose} style={styles.closeButton} {...(isTV && { hasTVPreferredFocus: true })}>
                <Icon name="close" size={28} color={colors.text} />
              </CloseButton>
            );
          })()}
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Compte Limon+ TV</Text>
          {(() => {
            const CloseButton = isTV ? TVFocusable : TouchableOpacity;
            return (
              <CloseButton onPress={onClose} style={styles.closeButton} {...(isTV && { hasTVPreferredFocus: true })}>
                <Icon name="close" size={28} color={colors.text} />
              </CloseButton>
            );
          })()}
        </View>
        <View style={styles.noDataContainer}>
          <Icon name="account_circle" size={64} color={colors.textTertiary} />
          <Text style={styles.noDataText}>Aucun compte connecté</Text>
          <Text style={styles.noDataSubtext}>
            Veuillez redémarrer l&apos;application pour effectuer l&apos;onboarding.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Compte Limon+ TV</Text>
        {(() => {
          const CloseButton = isTV ? TVFocusable : TouchableOpacity;
          return (
            <CloseButton onPress={onClose} style={styles.closeButton} {...(isTV && { hasTVPreferredFocus: true })}>
              <Icon name="close" size={28} color={colors.text} />
            </CloseButton>
          );
        })()}
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Icon name="person" size={48} color={colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userData.firstName}</Text>
              <Text style={styles.profileStatus}>{userData.status}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Informations du compte</Text>
        
        <AccountItem label="Nom d'utilisateur" value={userData.firstName} icon="person" />
        <AccountItem label="Numéro d'abonné" value={userData.subscriberId} icon="credit_card" />
        <AccountItem label="Offre" value={userData.offer} icon="star" />
        <AccountItem label="Statut" value={userData.status} icon="verified" />
        <AccountItem label="Date d'expiration" value={userData.expirationDate} icon="event" />

        <Text style={styles.sectionTitle}>Préférences</Text>
        
        {(() => {
          const PreferenceButton = isTV ? TVFocusable : TouchableOpacity;
          return (
            <>
              <PreferenceButton 
                style={styles.preferenceItem}
                onPress={onShowLanguageSettings}
                {...(isTV && {})}
              >
                <View style={styles.preferenceLeft}>
                  <Icon name="language" size={20} color={colors.primary} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceLabel}>Langue</Text>
                    <Text style={styles.preferenceValue}>Français</Text>
                  </View>
                </View>
                <Icon name="keyboard_arrow_right" size={20} color={colors.textTertiary} />
              </PreferenceButton>

              <PreferenceButton 
                style={styles.preferenceItem}
                onPress={onShowRegionSettings}
                {...(isTV && {})}
              >
                <View style={styles.preferenceLeft}>
                  <Icon name="location_city" size={20} color={colors.primary} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceLabel}>Région</Text>
                    <Text style={styles.preferenceValue}>Centrafrique</Text>
                  </View>
                </View>
                <Icon name="keyboard_arrow_right" size={20} color={colors.textTertiary} />
              </PreferenceButton>
            </>
          );
        })()}

        <Text style={styles.sectionTitle}>Actions</Text>
        
        {(() => {
          const ActionButton = isTV ? TVFocusable : TouchableOpacity;
          return (
            <>
              <ActionButton style={styles.actionButton} onPress={handleChangeAccount} {...(isTV && {})}>
                <Icon name="swap_horiz" size={18} color={colors.text} />
                <Text style={styles.actionButtonText}>Changer de compte</Text>
              </ActionButton>

              <ActionButton style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout} {...(isTV && {})}>
                <Icon name="logout" size={18} color="#ff4444" />
                <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Déconnecter</Text>
              </ActionButton>
            </>
          );
        })()}
      </ScrollView>
    </View>
  );
};

AccountSettingsPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  onShowLanguageSettings: PropTypes.func,
  onShowRegionSettings: PropTypes.func,
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
    padding: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  noDataSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  profileCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountTextContainer: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  accountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceText: {
    marginLeft: 12,
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  preferenceValue: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderColor: '#ff4444',
  },
  logoutButtonText: {
    color: '#ff4444',
  },
});

export default AccountSettingsPanel;
