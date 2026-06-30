import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';

const SubscriptionExpiredScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="cancel" size={100} color="#FF0000" />
          </View>
        </View>

        <Text style={styles.title}>Abonnement Expiré</Text>
        
        <View style={styles.messageCard}>
          <Icon name="error" size={32} color="#FF0000" />
          <Text style={styles.messageText}>
            Votre abonnement Limon+ TV est terminé.
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            L&apos;accès aux chaînes et à l&apos;interface de contrôle a été désactivé.
          </Text>
          <Text style={styles.infoText}>
            Veuillez renouveler votre abonnement pour continuer à profiter de nos services.
          </Text>
        </View>

        <View style={styles.contactContainer}>
          <Icon name="phone" size={24} color={colors.primary} />
          <Text style={styles.contactText}>Contactez notre service client pour renouveler votre abonnement</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Limon+ TV</Text>
          <Text style={styles.footerSubtext}>Votre divertissement, notre passion</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF0000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 30,
    textAlign: 'center',
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF0000',
    marginBottom: 30,
    width: '100%',
  },
  messageText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
    marginLeft: 15,
    flex: 1,
  },
  infoContainer: {
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 40,
  },
  contactText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
});

export default SubscriptionExpiredScreen;
