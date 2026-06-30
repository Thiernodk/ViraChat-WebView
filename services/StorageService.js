import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // Clés de stockage
  static KEYS = {
    SESSION: '@virachat_session',
    USER_PROFILE: '@virachat_user_profile',
    CONVERSATIONS: '@virachat_conversations',
    MESSAGES: '@virachat_messages',
    SETTINGS: '@virachat_settings',
    DRAFTS: '@virachat_drafts',
    OFFLINE_QUEUE: '@virachat_offline_queue',
    MEDIA_CACHE: '@virachat_media_cache',
    LAST_READ: '@virachat_last_read',
  };

  // Session de connexion
  static async saveSession(sessionData) {
    try {
      await AsyncStorage.setItem(this.KEYS.SESSION, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    }
  }

  static async getSession() {
    try {
      const session = await AsyncStorage.getItem(this.KEYS.SESSION);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  static async clearSession() {
    try {
      await AsyncStorage.removeItem(this.KEYS.SESSION);
      return true;
    } catch (error) {
      console.error('Error clearing session:', error);
      return false;
    }
  }

  // Profil utilisateur
  static async saveProfile(profileData) {
    try {
      await AsyncStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profileData));
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  }

  static async getProfile() {
    try {
      const profile = await AsyncStorage.getItem(this.KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  // Conversations
  static async saveConversations(conversations) {
    try {
      await AsyncStorage.setItem(this.KEYS.CONVERSATIONS, JSON.stringify(conversations));
      return true;
    } catch (error) {
      console.error('Error saving conversations:', error);
      return false;
    }
  }

  static async getConversations() {
    try {
      const conversations = await AsyncStorage.getItem(this.KEYS.CONVERSATIONS);
      return conversations ? JSON.parse(conversations) : [];
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  static async addConversation(conversation) {
    try {
      const conversations = await this.getConversations();
      const index = conversations.findIndex(c => c.id === conversation.id);
      if (index >= 0) {
        conversations[index] = conversation;
      } else {
        conversations.unshift(conversation);
      }
      await this.saveConversations(conversations);
      return true;
    } catch (error) {
      console.error('Error adding conversation:', error);
      return false;
    }
  }

  // Messages
  static async saveMessages(conversationId, messages) {
    try {
      const allMessages = await this.getAllMessages();
      allMessages[conversationId] = messages;
      await AsyncStorage.setItem(this.KEYS.MESSAGES, JSON.stringify(allMessages));
      return true;
    } catch (error) {
      console.error('Error saving messages:', error);
      return false;
    }
  }

  static async getMessages(conversationId) {
    try {
      const allMessages = await this.getAllMessages();
      return allMessages[conversationId] || [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  static async getAllMessages() {
    try {
      const messages = await AsyncStorage.getItem(this.KEYS.MESSAGES);
      return messages ? JSON.parse(messages) : {};
    } catch (error) {
      console.error('Error getting all messages:', error);
      return {};
    }
  }

  static async addMessage(conversationId, message) {
    try {
      const messages = await this.getMessages(conversationId);
      messages.push(message);
      await this.saveMessages(conversationId, messages);
      return true;
    } catch (error) {
      console.error('Error adding message:', error);
      return false;
    }
  }

  // Paramètres
  static async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  static async getSettings() {
    try {
      const settings = await AsyncStorage.getItem(this.KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : {
        theme: 'light',
        language: 'fr',
        notifications: true,
        sound: true,
        vibration: true,
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  // Brouillons
  static async saveDraft(conversationId, draft) {
    try {
      const drafts = await this.getDrafts();
      drafts[conversationId] = draft;
      await AsyncStorage.setItem(this.KEYS.DRAFTS, JSON.stringify(drafts));
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      return false;
    }
  }

  static async getDraft(conversationId) {
    try {
      const drafts = await this.getDrafts();
      return drafts[conversationId] || '';
    } catch (error) {
      console.error('Error getting draft:', error);
      return '';
    }
  }

  static async getDrafts() {
    try {
      const drafts = await AsyncStorage.getItem(this.KEYS.DRAFTS);
      return drafts ? JSON.parse(drafts) : {};
    } catch (error) {
      console.error('Error getting drafts:', error);
      return {};
    }
  }

  // File d'attente offline
  static async addToOfflineQueue(item) {
    try {
      const queue = await this.getOfflineQueue();
      queue.push({
        ...item,
        timestamp: Date.now(),
      });
      await AsyncStorage.setItem(this.KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
      return true;
    } catch (error) {
      console.error('Error adding to offline queue:', error);
      return false;
    }
  }

  static async getOfflineQueue() {
    try {
      const queue = await AsyncStorage.getItem(this.KEYS.OFFLINE_QUEUE);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error getting offline queue:', error);
      return [];
    }
  }

  static async clearOfflineQueue() {
    try {
      await AsyncStorage.removeItem(this.KEYS.OFFLINE_QUEUE);
      return true;
    } catch (error) {
      console.error('Error clearing offline queue:', error);
      return false;
    }
  }

  // Cache média
  static async cacheMedia(mediaId, mediaData) {
    try {
      const cache = await this.getMediaCache();
      cache[mediaId] = {
        ...mediaData,
        cachedAt: Date.now(),
      };
      await AsyncStorage.setItem(this.KEYS.MEDIA_CACHE, JSON.stringify(cache));
      return true;
    } catch (error) {
      console.error('Error caching media:', error);
      return false;
    }
  }

  static async getCachedMedia(mediaId) {
    try {
      const cache = await this.getMediaCache();
      return cache[mediaId] || null;
    } catch (error) {
      console.error('Error getting cached media:', error);
      return null;
    }
  }

  static async getMediaCache() {
    try {
      const cache = await AsyncStorage.getItem(this.KEYS.MEDIA_CACHE);
      return cache ? JSON.parse(cache) : {};
    } catch (error) {
      console.error('Error getting media cache:', error);
      return {};
    }
  }

  // Dernière position de lecture
  static async saveLastRead(conversationId, messageId) {
    try {
      const lastRead = await this.getLastRead();
      lastRead[conversationId] = messageId;
      await AsyncStorage.setItem(this.KEYS.LAST_READ, JSON.stringify(lastRead));
      return true;
    } catch (error) {
      console.error('Error saving last read:', error);
      return false;
    }
  }

  static async getLastRead(conversationId) {
    try {
      const lastRead = await this.getLastReadAll();
      return lastRead[conversationId] || null;
    } catch (error) {
      console.error('Error getting last read:', error);
      return null;
    }
  }

  static async getLastReadAll() {
    try {
      const lastRead = await AsyncStorage.getItem(this.KEYS.LAST_READ);
      return lastRead ? JSON.parse(lastRead) : {};
    } catch (error) {
      console.error('Error getting last read all:', error);
      return {};
    }
  }

  // Nettoyage du cache (optionnel)
  static async clearCache() {
    try {
      await AsyncStorage.multiRemove([
        this.KEYS.MEDIA_CACHE,
        this.KEYS.OFFLINE_QUEUE,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  // Supprimer toutes les données (logout)
  static async clearAll() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }
}

export default StorageService;
