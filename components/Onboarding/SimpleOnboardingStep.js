import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';
import platformDetectionService from '../../services/platformDetectionService';

const SimpleOnboardingStep = ({ username, subscriberId, onFinish }) => {
  const isTV = platformDetectionService.shouldEnableTVFeatures();
  const [localUsername, setLocalUsername] = useState(username);
  const [localSubscriberId, setLocalSubscriberId] = useState(subscriberId);
  const [errors, setErrors] = useState({ username: '', subscriberId: '' });

  const validate = () => {
    const newErrors = {};
    
    if (!localUsername.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    }
    
    if (!localSubscriberId.trim()) {
      newErrors.subscriberId = 'Le numéro d\'abonné est requis';
    } else if (localSubscriberId.length < 5) {
      newErrors.subscriberId = 'Le numéro d\'abonné doit contenir au moins 5 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onFinish(localUsername, localSubscriberId);
    }
  };

  const SubmitButton = isTV ? TVFocusable : TouchableOpacity;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Icon name="add_circle" size={64} color={colors.primary} />
            <Text style={styles.title}>Bienvenue</Text>
            <Text style={styles.subtitle}>Entrez vos informations pour commencer</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom d'utilisateur</Text>
              <View style={[styles.inputWrapper, errors.username && styles.inputError]}>
                <Icon name="person" size={24} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Votre nom"
                  placeholderTextColor={colors.textTertiary}
                  value={localUsername}
                  onChangeText={setLocalUsername}
                  autoCapitalize="words"
                  autoFocus
                />
              </View>
              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Numéro d'abonné</Text>
              <View style={[styles.inputWrapper, errors.subscriberId && styles.inputError]}>
                <Icon name="payment" size={24} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Votre numéro d'abonné"
                  placeholderTextColor={colors.textTertiary}
                  value={localSubscriberId}
                  onChangeText={setLocalSubscriberId}
                  keyboardType="numeric"
                  maxLength={20}
                />
              </View>
              {errors.subscriberId && <Text style={styles.errorText}>{errors.subscriberId}</Text>}
            </View>

            <View style={styles.infoBox}>
              <Icon name="info" size={20} color={colors.primary} />
              <Text style={styles.infoText}>
                Chaque numéro d'abonné vous donne 1 mois d'accès gratuit
              </Text>
            </View>

            <SubmitButton
              style={styles.submitButton}
              onPress={handleSubmit}
              {...(isTV && { hasTVPreferredFocus: true })}
            >
              <Icon name="check" size={24} color="#000" />
              <Text style={styles.submitButtonText}>Commencer</Text>
            </SubmitButton>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

SimpleOnboardingStep.propTypes = {
  username: PropTypes.string,
  subscriberId: PropTypes.string,
  onFinish: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.primary,
    marginLeft: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
});

export default SimpleOnboardingStep;
