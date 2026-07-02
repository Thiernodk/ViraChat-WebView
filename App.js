import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PlayerScreen from './screens/PlayerScreen';
import ResponsiveWrapper from './components/ResponsiveWrapper';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding/Onboarding';
import SubscriptionExpiredScreen from './components/Subscription/SubscriptionExpiredScreen';
import SubscriptionReactivedModal from './components/Subscription/SubscriptionReactivedModal';
import SubscriptionActivationScreen from './components/Subscription/SubscriptionActivationScreen';
import channelsData from './data/channel.json';
import epgData from './data/epg.json';
import onboardingService from './services/onboardingService';
import subscriptionService from './services/subscriptionService';
import userService from './services/userService';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showExpiredScreen, setShowExpiredScreen] = useState(false);
  const [showReactivationModal, setShowReactivationModal] = useState(false);
  const [showActivationScreen, setShowActivationScreen] = useState(false);
  const [channels, setChannels] = useState([]);
  const [epg, setEpg] = useState({});

  useEffect(() => {
    const initializeApp = async () => {
      setChannels(channelsData);
      setEpg(epgData);
      
      // Check if onboarding is completed
      const isOnboardingCompleted = await onboardingService.isOnboardingCompleted();
      setShowOnboarding(!isOnboardingCompleted);
      
      // Check subscription status if onboarding is completed
      if (isOnboardingCompleted) {
        // Expo Go mode - skip subscription checks entirely
        if (subscriptionService.isExpoGo()) {
          // Generate/get username for Expo Go
          await userService.getUsername();
          return;
        }

        // Check subscription number and load corresponding username
        const subscriptionNumber = await subscriptionService.getSubscriptionNumber();
        console.log('[App] Subscription number from storage:', subscriptionNumber);
        
        if (subscriptionNumber) {
          // Load username for this subscription
          const username = await userService.getUsernameForSubscription(subscriptionNumber);
          console.log('[App] Username for subscription:', username);
          
          if (username) {
            await userService.saveUsername(username, subscriptionNumber);
          } else {
            // Generate new username if none exists for this subscription
            const newUsername = userService.generateUsername(subscriptionNumber);
            await userService.saveUsername(newUsername, subscriptionNumber);
            console.log('[App] Generated new username:', newUsername);
          }
        }

        const shouldShowActivation = await subscriptionService.shouldShowActivationScreen();
        const isActive = await subscriptionService.isSubscriptionActive();
        
        console.log('[App] shouldShowActivation:', shouldShowActivation, 'isActive:', isActive);
        
        // Show activation screen only if subscription is required and no number is set
        if (shouldShowActivation) {
          setShowActivationScreen(true);
        } else if (!isActive) {
          setShowExpiredScreen(true);
        } else {
          // Check if reactivation message should be shown
          const wasReactivationShown = await subscriptionService.wasReactivationShown();
          if (!wasReactivationShown) {
            setShowReactivationModal(true);
          }
        }
      }
    };
    
    initializeApp();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleActivationSuccess = (result) => {
    setShowActivationScreen(false);
    if (result.unlimited) {
      // Unlimited subscription - show reactivation modal
      setShowReactivationModal(true);
    } else {
      // 1 month trial - show reactivation modal
      setShowReactivationModal(true);
    }
  };

  const handleActivationCancel = () => {
    setShowActivationScreen(false);
    // If cancelled, show expired screen
    setShowExpiredScreen(true);
  };

  return (
    <ResponsiveWrapper>
      <View style={styles.container}>
        {showSplash ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : showOnboarding ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : showActivationScreen ? (
          <SubscriptionActivationScreen
            onActivationSuccess={handleActivationSuccess}
            onCancel={handleActivationCancel}
          />
        ) : showExpiredScreen ? (
          <SubscriptionExpiredScreen />
        ) : (
          <>
            <PlayerScreen channels={channels} epgData={epg} />
            <SubscriptionReactivedModal
              visible={showReactivationModal}
              onClose={() => setShowReactivationModal(false)}
            />
          </>
        )}
      </View>
    </ResponsiveWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
