import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import subscriptionService from '../../services/subscriptionService';
import onboardingService from '../../services/onboardingService';
import TVFocusable from '../TVFocusable/TVFocusable';
import platformDetectionService from '../../services/platformDetectionService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isLandscape = screenWidth > screenHeight;

const SubscriptionReactivedModal = ({ visible, onClose }) => {
  const isTV = platformDetectionService.shouldEnableTVFeatures();
  const [userName, setUserName] = React.useState('');

  useEffect(() => {
    if (visible) {
      loadUserName();
    }
  }, [visible]);

  const loadUserName = async () => {
    const userData = await onboardingService.getUserData();
    if (userData) {
      setUserName(userData.firstName);
    }
  };

  const handleFinish = async () => {
    await subscriptionService.setReactivationShown();
    onClose();
  };

  const FinishButton = isTV ? TVFocusable : TouchableOpacity;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon name="check_circle" size={80} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.title}>Félicitations</Text>
          
          <View style={styles.messageCard}>
            <Icon name="stars" size={32} color={colors.primary} />
            <Text style={styles.messageText}>
              {userName ? `${userName}, votre abonnement à été réactivé avec succès.` : 'Votre abonnement a été réactivé avec succès.'}
            </Text>
          </View>

          <Text style={styles.infoText}>
            Vous pouvez maintenant profiter de toutes les chaînes Limon+ TV.
          </Text>

          <FinishButton
            style={styles.finishButton}
            onPress={handleFinish}
            activeOpacity={0.8}
            {...(isTV && { hasTVPreferredFocus: true })}
          >
            <Text style={styles.finishButtonText}>Terminer</Text>
            <Icon name="check" size={24} color="#000" />
          </FinishButton>
        </View>
      </View>
    </Modal>
  );
};

SubscriptionReactivedModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 12,
    width: isLandscape ? '40%' : '70%',
    maxWidth: isLandscape ? 400 : 300,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 254, 102, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  infoText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 16,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
  },
  finishButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5,
  },
});

export default SubscriptionReactivedModal;
