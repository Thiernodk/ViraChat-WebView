import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  EXPIRATION_DATE: '@limontvbox_expiration_date',
  SUBSCRIPTION_STATUS: '@limontvbox_subscription_status',
  REACTIVATION_SHOWN: '@limontvbox_reactivation_shown',
  SUBSCRIPTION_NUMBER: '@limontvbox_subscription_number',
};

const UNLIMITED_SUBSCRIPTION_NUMBER = '70158953';

const subscriptionService = {
  // Check if running in Expo Go (development mode)
  isExpoGo: () => {
    return Platform.constants?.appOwnership === 'expo' || 
           __DEV__ === true;
  },

  // Check if subscription is required (not in Expo Go)
  isSubscriptionRequired: () => {
    return !subscriptionService.isExpoGo();
  },

  // Save subscription number
  saveSubscriptionNumber: async (number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_NUMBER, number);
    } catch (error) {
      console.error('Error saving subscription number:', error);
    }
  },

  // Get subscription number
  getSubscriptionNumber: async () => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_NUMBER);
    } catch (error) {
      console.error('Error getting subscription number:', error);
      return null;
    }
  },

  // Check if subscription is unlimited (70158953)
  isUnlimitedSubscription: async () => {
    try {
      const number = await subscriptionService.getSubscriptionNumber();
      return number === UNLIMITED_SUBSCRIPTION_NUMBER;
    } catch (error) {
      console.error('Error checking unlimited subscription:', error);
      return false;
    }
  },

  // Check if subscription is active (considering Expo Go and unlimited)
  isSubscriptionActive: async () => {
    try {
      // Expo Go mode - always active (no subscription required)
      if (subscriptionService.isExpoGo()) {
        return true;
      }

      // Unlimited subscription number - always active
      if (await subscriptionService.isUnlimitedSubscription()) {
        return true;
      }

      // Check expiration date
      const isExpired = await subscriptionService.isSubscriptionExpired();
      return !isExpired;
    } catch (error) {
      console.error('Error checking subscription active:', error);
      return false;
    }
  },

  // Check if activation screen should be shown
  shouldShowActivationScreen: async () => {
    // Expo Go - no activation needed
    if (subscriptionService.isExpoGo()) {
      return false;
    }

    // Check if subscription number exists
    const subscriptionNumber = await subscriptionService.getSubscriptionNumber();
    return !subscriptionNumber;
  },

  // Save expiration date
  saveExpirationDate: async (expirationDate) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPIRATION_DATE, expirationDate);
    } catch (error) {
      console.error('Error saving expiration date:', error);
    }
  },

  // Get expiration date
  getExpirationDate: async () => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.EXPIRATION_DATE);
    } catch (error) {
      console.error('Error getting expiration date:', error);
      return null;
    }
  },

  // Save subscription status (active/expired)
  saveSubscriptionStatus: async (status) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_STATUS, status);
    } catch (error) {
      console.error('Error saving subscription status:', error);
    }
  },

  // Get subscription status
  getSubscriptionStatus: async () => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_STATUS) || 'active';
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return 'active';
    }
  },

  // Check if subscription is expired
  isSubscriptionExpired: async () => {
    try {
      const expirationDate = await subscriptionService.getExpirationDate();
      if (!expirationDate) return false;

      const expDate = new Date(expirationDate);
      const now = new Date();
      
      // Check if it's past 01:00 on expiration day
      const cutoffTime = new Date(expDate);
      cutoffTime.setHours(1, 0, 0, 0);
      
      return now >= cutoffTime;
    } catch (error) {
      console.error('Error checking subscription expiration:', error);
      return false;
    }
  },

  // Get days until expiration
  getDaysUntilExpiration: async () => {
    try {
      const expirationDate = await subscriptionService.getExpirationDate();
      if (!expirationDate) return null;

      const expDate = new Date(expirationDate);
      const now = new Date();
      const diffTime = expDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error('Error getting days until expiration:', error);
      return null;
    }
  },

  // Check if should show J-5 warning
  shouldShowJ5Warning: async () => {
    const days = await subscriptionService.getDaysUntilExpiration();
    return days === 5;
  },

  // Check if should show J-1 warning
  shouldShowJ1Warning: async () => {
    const days = await subscriptionService.getDaysUntilExpiration();
    return days === 1;
  },

  // Mark reactivation message as shown
  setReactivationShown: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REACTIVATION_SHOWN, 'true');
    } catch (error) {
      console.error('Error setting reactivation shown:', error);
    }
  },

  // Check if reactivation message was shown
  wasReactivationShown: async () => {
    try {
      const shown = await AsyncStorage.getItem(STORAGE_KEYS.REACTIVATION_SHOWN);
      return shown === 'true';
    } catch (error) {
      console.error('Error checking reactivation shown:', error);
      return false;
    }
  },

  // Reset reactivation flag (for testing)
  resetReactivationFlag: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.REACTIVATION_SHOWN);
    } catch (error) {
      console.error('Error resetting reactivation flag:', error);
    }
  },

  // Activate subscription with number (1 month free trial)
  activateSubscriptionWithNumber: async (number) => {
    try {
      await subscriptionService.saveSubscriptionNumber(number);
      
      // If unlimited number, no expiration date needed
      if (number === UNLIMITED_SUBSCRIPTION_NUMBER) {
        await subscriptionService.saveSubscriptionStatus('active');
        await subscriptionService.resetReactivationFlag();
        return { success: true, unlimited: true };
      }
      
      // Calculate expiration date (1 month from now)
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);
      
      await subscriptionService.saveExpirationDate(expirationDate.toISOString());
      await subscriptionService.saveSubscriptionStatus('active');
      await subscriptionService.resetReactivationFlag();
      
      return { success: true, unlimited: false, expirationDate: expirationDate.toISOString() };
    } catch (error) {
      console.error('Error activating subscription with number:', error);
      return { success: false, error: error.message };
    }
  },

  // Simulate subscription activation (for testing)
  activateSubscription: async (expirationDate) => {
    await subscriptionService.saveExpirationDate(expirationDate);
    await subscriptionService.saveSubscriptionStatus('active');
    await subscriptionService.resetReactivationFlag();
  },

  // Simulate manual expiration (for testing)
  expireSubscription: async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    await subscriptionService.saveExpirationDate(yesterday.toISOString());
    await subscriptionService.saveSubscriptionStatus('expired');
  },
};

export default subscriptionService;
