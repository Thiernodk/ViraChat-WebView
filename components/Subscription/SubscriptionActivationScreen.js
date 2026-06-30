import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import subscriptionService from '../../services/subscriptionService';
import userService from '../../services/userService';
import TVFocusable from '../TVFocusable/TVFocusable';

const SubscriptionActivationScreen = ({ onActivationSuccess, onCancel }) => {
  const [subscriptionNumber, setSubscriptionNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleActivate = async () => {
    if (!subscriptionNumber.trim()) {
      setError('Veuillez entrer un numéro d&apos;abonnement');
      return;
    }

    setLoading(true);
    setError('');

    const result = await subscriptionService.activateSubscriptionWithNumber(subscriptionNumber.trim());

    setLoading(false);

    if (result.success) {
      // Generate and save unique username for this subscription
      const username = userService.generateUsername(subscriptionNumber.trim());
      await userService.saveUsername(username, subscriptionNumber.trim());
      console.log('[SubscriptionActivationScreen] Generated username:', username, 'for subscription:', subscriptionNumber.trim());
      
      setSuccess(true);
      setTimeout(() => {
        onActivationSuccess(result);
      }, 2000);
    } else {
      setError('Erreur lors de l&apos;activation. Veuillez réessayer.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon name="tv" size={64} color={colors.primary} />
          </View>

          <Text style={styles.title}>Activer votre abonnement</Text>
          <Text style={styles.subtitle}>
            Entrez votre numéro d&apos;abonnement pour profiter de Limon+ TV
          </Text>

          {!success ? (
            <>
              <View style={styles.inputContainer}>
                <Icon name="key" size={24} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Numéro d&apos;abonnement"
                  placeholderTextColor={colors.textTertiary}
                  value={subscriptionNumber}
                  onChangeText={setSubscriptionNumber}
                  keyboardType="numeric"
                  maxLength={20}
                  autoFocus
                />
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="error" size={20} color="#FF0000" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TVFocusable
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleActivate}
                disabled={loading}
                hasTVPreferredFocus={true}
                nextFocusDown="cancel"
              >
                {loading ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Activer</Text>
                )}
              </TVFocusable>

              <TVFocusable
                style={styles.cancelButton}
                onPress={onCancel}
                nextFocusUp="activate"
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TVFocusable>

              <View style={styles.infoContainer}>
                <Icon name="info" size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  1 mois d&apos;essai gratuit pour tout nouveau numéro d&apos;abonnement
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Icon name="check_circle" size={64} color={colors.primary} />
              <Text style={styles.successText}>Abonnement activé avec succès !</Text>
              <Text style={styles.successSubtext}>
                {subscriptionNumber === '70158953' 
                  ? 'Abonnement illimité activé' 
                  : '1 mois d&apos;essai gratuit activé'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

SubscriptionActivationScreen.propTypes = {
  onActivationSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    maxWidth: 350,
    width: '100%',
    alignSelf: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 12,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SubscriptionActivationScreen;
