import AsyncStorage from '@react-native-async-storage/async-storage';
import subscriptionService from './subscriptionService';

const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@limontvbox_onboarding_completed',
  USER_DATA: '@limontvbox_user_data',
  LANGUAGE: '@limontvbox_language',
  COUNTRY: '@limontvbox_country',
  REGION: '@limontvbox_region',
  SUBSCRIBER_ID: '@limontvbox_subscriber_id',
  USERNAME: '@limontvbox_username',
  SUBSCRIPTION_EXPIRATION: '@limontvbox_subscription_expiration',
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

  // Save username
  saveUsername: async (username) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
    } catch (error) {
      console.error('Error saving username:', error);
    }
  },

  // Get username
  getUsername: async () => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
    } catch (error) {
      console.error('Error getting username:', error);
      return null;
    }
  },

  // Save subscription expiration
  saveSubscriptionExpiration: async (expirationDate) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_EXPIRATION, expirationDate);
      await subscriptionService.saveExpirationDate(expirationDate);
      await subscriptionService.saveSubscriptionStatus('active');
    } catch (error) {
      console.error('Error saving subscription expiration:', error);
    }
  },

  // Get subscription expiration
  getSubscriptionExpiration: async () => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_EXPIRATION);
    } catch (error) {
      console.error('Error getting subscription expiration:', error);
      return null;
    }
  },

  // Save user data (simplified for new onboarding)
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

  // Get user data (simplified for new onboarding)
  getUserData: async () => {
    try {
      const username = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
      const subscriberId = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIBER_ID);
      const expirationDate = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_EXPIRATION);
      
      if (username && subscriberId) {
        return {
          firstName: username,
          lastName: '',
          subscriberId: subscriberId,
          status: 'Actif',
          expirationDate: expirationDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          offer: 'Gratuit',
          profilePhoto: null,
        };
      }
      
      // Fallback to old format if exists
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
        STORAGE_KEYS.USERNAME,
        STORAGE_KEYS.SUBSCRIPTION_EXPIRATION,
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
