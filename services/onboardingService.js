import AsyncStorage from '@react-native-async-storage/async-storage';
import subscriptionService from './subscriptionService';

const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@limontvbox_onboarding_completed',
  USER_DATA: '@limontvbox_user_data',
  LANGUAGE: '@limontvbox_language',
  COUNTRY: '@limontvbox_country',
  REGION: '@limontvbox_region',
  SUBSCRIBER_ID: '@limontvbox_subscriber_id',
};

const onboardingService = {
  // Check if onboarding is completed
  isOnboardingCompleted: async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  },

  // Mark onboarding as completed
  setOnboardingCompleted: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    } catch (error) {
      console.error('Error setting onboarding completed:', error);
    }
  },

  // Save user data
  saveUserData: async (userData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      // Also save expiration date to subscription service
      if (userData.expirationDate) {
        await subscriptionService.saveExpirationDate(userData.expirationDate);
        await subscriptionService.saveSubscriptionStatus('active');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  // Get user data
  getUserData: async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Save language
  saveLanguage: async (language) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  },

  // Get language
  getLanguage: async () => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'Français';
    } catch (error) {
      console.error('Error getting language:', error);
      return 'Français';
    }
  },

  // Save country
  saveCountry: async (country) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COUNTRY, country);
    } catch (error) {
      console.error('Error saving country:', error);
    }
  },

  // Get country
  getCountry: async () => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.COUNTRY) || 'Centrafrique';
    } catch (error) {
      console.error('Error getting country:', error);
      return 'Centrafrique';
    }
  },

  // Save region
  saveRegion: async (region) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REGION, region);
    } catch (error) {
      console.error('Error saving region:', error);
    }
  },

  // Get region
  getRegion: async () => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REGION) || 'Bangui';
    } catch (error) {
      console.error('Error getting region:', error);
      return 'Bangui';
    }
  },

  // Save subscriber ID
  saveSubscriberId: async (subscriberId) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIBER_ID, subscriberId);
    } catch (error) {
      console.error('Error saving subscriber ID:', error);
    }
  },

  // Get subscriber ID
  getSubscriberId: async () => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIBER_ID);
    } catch (error) {
      console.error('Error getting subscriber ID:', error);
      return null;
    }
  },

  // Clear all onboarding data (for logout/reset)
  clearOnboardingData: async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ONBOARDING_COMPLETED,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.LANGUAGE,
        STORAGE_KEYS.COUNTRY,
        STORAGE_KEYS.REGION,
        STORAGE_KEYS.SUBSCRIBER_ID,
      ]);
    } catch (error) {
      console.error('Error clearing onboarding data:', error);
    }
  },

  // Simulate API call for subscriber authentication (TEST MODE)
  authenticateSubscriber: async (subscriberId) => {
    // In production, this would be a real API call
    // For now, return simulated data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          firstName: 'Thierno',
          lastName: 'OPPORTUN',
          subscriberId: subscriberId,
          status: 'Actif',
          expirationDate: '2025-12-31',
          offer: 'Premium',
          profilePhoto: null,
        });
      }, 1000);
    });
  },
};

export default onboardingService;
