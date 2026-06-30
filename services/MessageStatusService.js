import StorageService from './StorageService';

class MessageStatusService {
  // États des messages
  static MESSAGE_STATUS = {
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read',
    FAILED: 'failed',
    SENDING: 'sending',
  };

  // Sauvegarder le statut d'un message
  static async updateMessageStatus(conversationId, messageId, status) {
    try {
      const messages = await StorageService.getMessages(conversationId);
      const messageIndex = messages.findIndex(m => m.id === messageId);
      
      if (messageIndex >= 0) {
        messages[messageIndex].status = status;
        messages[messageIndex].statusTimestamp = Date.now();
        await StorageService.saveMessages(conversationId, messages);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating message status:', error);
      return false;
    }
  }

  // Marquer un message comme lu
  static async markAsRead(conversationId, messageId) {
    return await this.updateMessageStatus(conversationId, messageId, this.MESSAGE_STATUS.READ);
  }

  // Marquer un message comme délivré
  static async markAsDelivered(conversationId, messageId) {
    return await this.updateMessageStatus(conversationId, messageId, this.MESSAGE_STATUS.DELIVERED);
  }

  // Marquer un message comme envoyé
  static async markAsSent(conversationId, messageId) {
    return await this.updateMessageStatus(conversationId, messageId, this.MESSAGE_STATUS.SENT);
  }

  // Marquer un message comme échoué
  static async markAsFailed(conversationId, messageId) {
    return await this.updateMessageStatus(conversationId, messageId, this.MESSAGE_STATUS.FAILED);
  }

  // Marquer tous les messages d'une conversation comme lus
  static async markConversationAsRead(conversationId) {
    try {
      const messages = await StorageService.getMessages(conversationId);
      let updated = false;
      
      for (const message of messages) {
        if (message.status !== this.MESSAGE_STATUS.READ && !message.isFromMe) {
          message.status = this.MESSAGE_STATUS.READ;
          message.statusTimestamp = Date.now();
          updated = true;
        }
      }
      
      if (updated) {
        await StorageService.saveMessages(conversationId, messages);
        // Mettre à jour la dernière position de lecture
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
          await StorageService.saveLastRead(conversationId, lastMessage.id);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return false;
    }
  }

  // Obtenir le nombre de messages non lus
  static async getUnreadCount(conversationId) {
    try {
      const messages = await StorageService.getMessages(conversationId);
      const lastReadId = await StorageService.getLastRead(conversationId);
      
      if (!lastReadId) {
        return messages.filter(m => !m.isFromMe && m.status !== this.MESSAGE_STATUS.READ).length;
      }
      
      // Compter les messages après le dernier message lu
      const lastReadIndex = messages.findIndex(m => m.id === lastReadId);
      if (lastReadIndex === -1) {
        return 0;
      }
      
      return messages.slice(lastReadIndex + 1).filter(m => !m.isFromMe).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Gestion des indicateurs de saisie
  static async setTypingIndicator(conversationId, userId, isTyping) {
    try {
      const typingIndicators = await this.getTypingIndicators();
      
      if (!typingIndicators[conversationId]) {
        typingIndicators[conversationId] = {};
      }
      
      typingIndicators[conversationId][userId] = {
        isTyping,
        timestamp: Date.now(),
      };
      
      await StorageService.saveSettings({ typingIndicators });
      return true;
    } catch (error) {
      console.error('Error setting typing indicator:', error);
      return false;
    }
  }

  static async getTypingIndicators() {
    try {
      const settings = await StorageService.getSettings();
      return settings.typingIndicators || {};
    } catch (error) {
      console.error('Error getting typing indicators:', error);
      return {};
    }
  }

  static async isUserTyping(conversationId, userId) {
    try {
      const typingIndicators = await this.getTypingIndicators();
      const indicator = typingIndicators[conversationId]?.[userId];
      
      if (!indicator) {
        return false;
      }
      
      // L'indicateur expire après 10 secondes
      const isExpired = Date.now() - indicator.timestamp > 10000;
      if (isExpired) {
        await this.setTypingIndicator(conversationId, userId, false);
        return false;
      }
      
      return indicator.isTyping;
    } catch (error) {
      console.error('Error checking if user is typing:', error);
      return false;
    }
  }

  // Nettoyer les anciens indicateurs de saisie
  static async cleanupTypingIndicators() {
    try {
      const typingIndicators = await this.getTypingIndicators();
      const now = Date.now();
      const cleaned = {};
      
      for (const [conversationId, users] of Object.entries(typingIndicators)) {
        cleaned[conversationId] = {};
        for (const [userId, indicator] of Object.entries(users)) {
          if (now - indicator.timestamp <= 10000) {
            cleaned[conversationId][userId] = indicator;
          }
        }
      }
      
      const settings = await StorageService.getSettings();
      settings.typingIndicators = cleaned;
      await StorageService.saveSettings(settings);
      
      return true;
    } catch (error) {
      console.error('Error cleaning up typing indicators:', error);
      return false;
    }
  }

  // Obtenir le statut de présence d'un utilisateur
  static async setUserPresence(userId, presence) {
    try {
      const presenceData = await this.getPresenceData();
      presenceData[userId] = {
        ...presence,
        lastSeen: Date.now(),
      };
      
      await StorageService.saveSettings({ presenceData });
      return true;
    } catch (error) {
      console.error('Error setting user presence:', error);
      return false;
    }
  }

  static async getPresenceData() {
    try {
      const settings = await StorageService.getSettings();
      return settings.presenceData || {};
    } catch (error) {
      console.error('Error getting presence data:', error);
      return {};
    }
  }

  static async getUserPresence(userId) {
    try {
      const presenceData = await this.getPresenceData();
      return presenceData[userId] || { status: 'offline', lastSeen: null };
    } catch (error) {
      console.error('Error getting user presence:', error);
      return { status: 'offline', lastSeen: null };
    }
  }

  // Marquer l'utilisateur actuel comme en ligne
  static async setCurrentUserOnline() {
    return await this.setUserPresence('current', { status: 'online' });
  }

  // Marquer l'utilisateur actuel comme hors ligne
  static async setCurrentUserOffline() {
    return await this.setUserPresence('current', { status: 'offline' });
  }
}

export default MessageStatusService;
