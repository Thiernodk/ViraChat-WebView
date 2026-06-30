import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@limontvbox_username';
const USERNAME_MAPPING_KEY = '@limontvbox_username_mapping';

const userService = {
  // Generate a unique username based on subscription number
  generateUsername: (subscriptionNumber) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const number = String(timestamp).slice(-8) + String(random).padStart(4, '0');
    return `Userlimon+tv-${number}`;
  },

  // Save username with subscription number mapping
  saveUsername: async (username, subscriptionNumber) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, username);
      
      // Save mapping between subscription number and username
      const mapping = await userService.getUsernameMapping();
      mapping[subscriptionNumber] = username;
      await AsyncStorage.setItem(USERNAME_MAPPING_KEY, JSON.stringify(mapping));
      
      console.log('[UserService] Username saved:', username, 'for subscription:', subscriptionNumber);
    } catch (error) {
      console.error('Error saving username:', error);
    }
  },

  // Get username for a specific subscription number
  getUsernameForSubscription: async (subscriptionNumber) => {
    try {
      const mapping = await userService.getUsernameMapping();
      return mapping[subscriptionNumber] || null;
    } catch (error) {
      console.error('Error getting username for subscription:', error);
      return null;
    }
  },

  // Get username mapping
  getUsernameMapping: async () => {
    try {
      const mapping = await AsyncStorage.getItem(USERNAME_MAPPING_KEY);
      return mapping ? JSON.parse(mapping) : {};
    } catch (error) {
      console.error('Error getting username mapping:', error);
      return {};
    }
  },

  // Get current username
  getUsername: async () => {
    try {
      const username = await AsyncStorage.getItem(STORAGE_KEY);
      if (username) {
        return username;
      }
      
      // Generate and save new username if none exists
      const newUsername = userService.generateUsername('default');
      await userService.saveUsername(newUsername, 'default');
      return newUsername;
    } catch (error) {
      console.error('Error getting username:', error);
      return null;
    }
  },

  // Check if username exists
  hasUsername: async () => {
    try {
      const username = await AsyncStorage.getItem(STORAGE_KEY);
      return username !== null;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  },

  // Reset username (for testing)
  resetUsername: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(USERNAME_MAPPING_KEY);
    } catch (error) {
      console.error('Error resetting username:', error);
    }
  },
};

export default userService;
