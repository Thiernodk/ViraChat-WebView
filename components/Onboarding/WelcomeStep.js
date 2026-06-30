import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';

const WelcomeStep = ({ userData, onFinish }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <TVFocusable
        style={styles.finishButtonTop}
        onPress={onFinish}
        hasTVPreferredFocus={true}
      >
        <Text style={styles.finishButtonTextTop}>Terminer</Text>
        <Icon name="check" size={20} color="#000" />
      </TVFocusable>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="check_circle" size={80} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.welcomeText}>Bienvenue,</Text>
        <Text style={styles.userName}>
          {userData?.firstName} {userData?.lastName}
        </Text>

        <View style={styles.messageCard}>
          <Icon name="tv" size={32} color={colors.primary} />
          <Text style={styles.messageText}>
            Votre compte Limon+ TV est prêt.
          </Text>
        </View>

        <Text style={styles.thankYouText}>
          Merci de faire partie de l&apos;expérience Limon+.
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="badge" size={20} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>Numéro d&apos;abonné</Text>
            <Text style={styles.infoValue}>{userData?.subscriberId}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="workspace_premium" size={20} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>Offre</Text>
            <Text style={styles.infoValue}>{userData?.offer}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

WelcomeStep.propTypes = {
  userData: PropTypes.object.isRequired,
  onFinish: PropTypes.func.isRequired,
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
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  thankYouText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  infoItem: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 6,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  finishButtonTop: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  finishButtonTextTop: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 6,
  },
});

export default WelcomeStep;
