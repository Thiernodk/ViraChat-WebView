import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';

const AccountConnectionStep = ({ onNext, onAuthenticate }) => {
  const [subscriberId, setSubscriberId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!subscriberId.trim()) {
      setError('Veuillez entrer votre numéro d\'abonné');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userData = await onAuthenticate(subscriberId.trim());
      onNext(userData);
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Icon name="account_circle" size={64} color={colors.primary} />
          <Text style={styles.title}>Ajouter votre compte Limon+ TV</Text>
          <Text style={styles.subtitle}>
            Entrez votre numéro d&apos;abonné pour accéder à votre compte
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Numéro d&apos;abonné</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre numéro d&apos;abonné"
              placeholderTextColor={colors.textTertiary}
              value={subscriberId}
              onChangeText={setSubscriberId}
              keyboardType="numeric"
              autoCapitalize="none"
              autoFocus
            />
            <Icon name="badge" size={20} color={colors.textTertiary} style={styles.inputIcon} />
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="error" size={20} color="#ff4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TVFocusable
            style={[styles.connectButton, (!subscriberId.trim() || isLoading) && styles.connectButtonDisabled]}
            onPress={handleSubmit}
            disabled={!subscriberId.trim() || isLoading}
            hasTVPreferredFocus={true}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <>
                <Text style={styles.connectButtonText}>Se connecter</Text>
                <Icon name="login" size={24} color="#000" />
              </>
            )}
          </TVFocusable>
        </View>

        <View style={styles.infoBox}>
          <Icon name="info" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Mode TEST actif: Tous les numéros d&apos;abonné sont acceptés pour les tests.
          </Text>
        </View>
      </View>
    </View>
  );
};

AccountConnectionStep.propTypes = {
  onNext: PropTypes.func.isRequired,
  onAuthenticate: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  form: {
    gap: 16,
  },
  inputContainer: {
    position: 'relative',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    paddingRight: 40,
    fontSize: 15,
    color: colors.text,
  },
  inputIcon: {
    position: 'absolute',
    right: 14,
    top: 38,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  errorText: {
    fontSize: 14,
    color: '#ff4444',
    marginLeft: 8,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
  },
  connectButtonDisabled: {
    backgroundColor: colors.border,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 6,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: 16,
  },
  infoText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 10,
    flex: 1,
    lineHeight: 16,
  },
});

export default AccountConnectionStep;
