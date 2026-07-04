import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import SimpleOnboardingStep from './SimpleOnboardingStep';
import onboardingService from '../../services/onboardingService';

const Onboarding = ({ onComplete }) => {
  const [onboardingData, setOnboardingData] = useState({
    username: '',
    subscriberId: '',
  });

  const handleFinish = async (username, subscriberId) => {
    // Save data to storage
    await onboardingService.saveUsername(username);
    await onboardingService.saveSubscriberId(subscriberId);
    await onboardingService.setOnboardingCompleted();
    
    // Set subscription expiration to 1 month from now
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    await onboardingService.saveSubscriptionExpiration(expirationDate.toISOString());
    
    onComplete();
  };

  return (
    <View style={styles.container}>
      <SimpleOnboardingStep
        username={onboardingData.username}
        subscriberId={onboardingData.subscriberId}
        onFinish={handleFinish}
      />
    </View>
  );
};

Onboarding.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default Onboarding;
