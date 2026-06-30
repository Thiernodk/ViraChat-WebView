import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import LanguageSelectionStep from './LanguageSelectionStep';
import CountrySelectionStep from './CountrySelectionStep';
import RegionSelectionStep from './RegionSelectionStep';
import AccountConnectionStep from './AccountConnectionStep';
import WelcomeStep from './WelcomeStep';
import onboardingService from '../../services/onboardingService';

const Onboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    language: '',
    country: '',
    region: '',
    subscriberId: '',
    userData: null,
  });

  const handleLanguageSelect = (language) => {
    setOnboardingData({ ...onboardingData, language });
  };

  const handleCountrySelect = (country) => {
    setOnboardingData({ ...onboardingData, country });
  };

  const handleRegionSelect = (region) => {
    setOnboardingData({ ...onboardingData, region });
  };

  const handleAccountAuthenticate = async (subscriberId) => {
    setOnboardingData({ ...onboardingData, subscriberId });
    const userData = await onboardingService.authenticateSubscriber(subscriberId);
    return userData;
  };

  const handleAccountNext = (userData) => {
    setOnboardingData({ ...onboardingData, userData });
    setCurrentStep(5);
  };

  const handleFinish = async () => {
    // Save all data to storage
    await onboardingService.saveLanguage(onboardingData.language);
    await onboardingService.saveCountry(onboardingData.country);
    await onboardingService.saveRegion(onboardingData.region);
    await onboardingService.saveSubscriberId(onboardingData.subscriberId);
    await onboardingService.saveUserData(onboardingData.userData);
    await onboardingService.setOnboardingCompleted();
    
    onComplete();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LanguageSelectionStep
            selectedLanguage={onboardingData.language}
            onSelect={handleLanguageSelect}
            onNext={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <CountrySelectionStep
            selectedCountry={onboardingData.country}
            onSelect={handleCountrySelect}
            onNext={() => setCurrentStep(3)}
          />
        );
      case 3:
        return (
          <RegionSelectionStep
            selectedRegion={onboardingData.region}
            onSelect={handleRegionSelect}
            onNext={() => setCurrentStep(4)}
          />
        );
      case 4:
        return (
          <AccountConnectionStep
            onNext={handleAccountNext}
            onAuthenticate={handleAccountAuthenticate}
          />
        );
      case 5:
        return (
          <WelcomeStep
            userData={onboardingData.userData}
            onFinish={handleFinish}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderStep()}
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
