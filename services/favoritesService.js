import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@limontvbox_favorites';

const favoritesService = {
  // Get all favorite channel IDs
  getFavorites: async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  // Add a channel to favorites
  addFavorite: async (channelId) => {
    try {
      const favorites = await favoritesService.getFavorites();
      if (!favorites.includes(channelId)) {
        favorites.push(channelId);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  // Remove a channel from favorites
  removeFavorite: async (channelId) => {
    try {
      const favorites = await favoritesService.getFavorites();
      const updatedFavorites = favorites.filter(id => id !== channelId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  // Check if a channel is favorite
  isFavorite: async (channelId) => {
    try {
      const favorites = await favoritesService.getFavorites();
      return favorites.includes(channelId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  // Toggle favorite status
  toggleFavorite: async (channelId) => {
    try {
      const isFav = await favoritesService.isFavorite(channelId);
      if (isFav) {
        await favoritesService.removeFavorite(channelId);
        return false;
      } else {
        await favoritesService.addFavorite(channelId);
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  },
};

export default favoritesService;
