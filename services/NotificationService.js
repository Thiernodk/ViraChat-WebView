import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, AppState } from 'react-native';
import StorageService from './StorageService';
import * as FileSystem from 'expo-file-system';

class NotificationService {
  static isConfigured = false;

  // Configurer les notifications
  static async configure() {
    if (this.isConfigured) {
      return true;
    }

    // Configurer le handler de notification
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Demander les permissions
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return false;
      }
      
      // Configurer les canaux Android
      if (Platform.OS === 'android') {
        await this.setupAndroidChannels();
      }
      
      // Obtenir le token de push
      const token = await this.getPushToken();
      if (token) {
        await StorageService.saveSettings({ pushToken: token });
        console.log('Push token obtained:', token);
      }
      
      this.isConfigured = true;
      return true;
    }
    
    return false;
  }

  // Configurer les canaux de notification Android
  static async setupAndroidChannels() {
    // Canal pour les messages
    await Notifications.setNotificationChannelAsync('virachat-messages', {
      name: 'ViraChat Messages',
      description: 'Notifications pour les nouveaux messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#006d37',
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
    });

    // Canal pour les appels
    await Notifications.setNotificationChannelAsync('virachat-calls', {
      name: 'ViraChat Calls',
      description: 'Notifications pour les appels entrants',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 200, 500],
      lightColor: '#006d37',
      sound: 'default',
      enableVibrate: true,
      showBadge: false,
    });

    // Canal pour les messages vocaux
    await Notifications.setNotificationChannelAsync('virachat-voice', {
      name: 'ViraChat Voice Messages',
      description: 'Notifications pour les messages vocaux',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#006d37',
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
    });
  }

  // Obtenir le token de push
  static async getPushToken() {
    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // À remplacer par votre projet ID Expo
      });
      
      return tokenData.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Envoyer une notification locale avec photo de profil
  static async sendLocalNotification(title, body, data = {}, options = {}) {
    try {
      const notificationContent = {
        title,
        body,
        data,
        sound: options.sound !== false ? true : false,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        categoryIdentifier: options.category || 'virachat-messages',
      };

      // Ajouter la photo de profil si fournie
      if (options.profilePhoto) {
        if (options.profilePhoto.startsWith('http')) {
          // Télécharger et utiliser la photo distante
          const localUri = await this.downloadAndCacheImage(options.profilePhoto);
          if (localUri) {
            notificationContent.data.profilePhoto = localUri;
          }
        } else {
          notificationContent.data.profilePhoto = options.profilePhoto;
        }
      }

      // Ajouter des actions si fournies
      if (options.actions) {
        notificationContent.categoryIdentifier = options.category;
      }

      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: null, // Notification immédiate
      });
      
      return true;
    } catch (error) {
      console.error('Error sending local notification:', error);
      return false;
    }
  }

  // Télécharger et mettre en cache une image
  static async downloadAndCacheImage(url) {
    try {
      const filename = url.split('/').pop();
      const cacheDir = `${FileSystem.documentDirectory}virachat_images/`;
      
      // Créer le répertoire de cache
      const dirInfo = await FileSystem.getInfoAsync(cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
      }
      
      const localPath = `${cacheDir}${filename}`;
      
      // Vérifier si déjà en cache
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      if (fileInfo.exists) {
        return localPath;
      }
      
      // Télécharger l'image
      const downloadResult = await FileSystem.downloadAsync(url, localPath);
      return downloadResult.uri;
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  }

  // Notification de nouveau message avec photo de profil
  static async notifyNewMessage(senderName, message, conversationId, options = {}) {
    const settings = await StorageService.getSettings();
    
    if (settings.notifications) {
      const isVoiceMessage = options.isVoiceMessage;
      const body = isVoiceMessage ? '🎤 Message vocal' : message;
      
      return await this.sendLocalNotification(
        senderName,
        body,
        { 
          type: 'new_message', 
          conversationId,
          messageId: options.messageId,
          isVoiceMessage,
        },
        {
          profilePhoto: options.profilePhoto,
          category: 'virachat-messages',
          sound: true,
        }
      );
    }
    
    return false;
  }

  // Notification avec actions (Répondre, Marquer comme lu)
  static async notifyNewMessageWithActions(senderName, message, conversationId, options = {}) {
    const settings = await StorageService.getSettings();
    
    if (settings.notifications) {
      // Définir la catégorie avec actions
      await Notifications.setNotificationCategoryAsync('virachat-messages', [
        {
          identifier: 'REPLY',
          buttonTitle: 'Répondre',
          textInput: {
            submitButtonTitle: 'Envoyer',
            placeholder: 'Votre réponse...',
          },
        },
        {
          identifier: 'MARK_READ',
          buttonTitle: 'Marquer comme lu',
          options: { isDestructive: false },
        },
      ]);

      return await this.notifyNewMessage(senderName, message, conversationId, options);
    }
    
    return false;
  }

  // Notification d'appel entrant (full-screen sur Android)
  static async notifyIncomingCall(callerName, callType = 'audio', options = {}) {
    const settings = await StorageService.getSettings();
    
    if (settings.notifications) {
      const callIcon = callType === 'video' ? '📹' : '📞';
      
      return await this.sendLocalNotification(
        `${callIcon} Appel ${callType}`,
        callerName,
        { 
          type: 'incoming_call', 
          callType,
          callerId: options.callerId,
          callSessionId: options.callSessionId,
        },
        {
          profilePhoto: options.profilePhoto,
          category: 'virachat-calls',
          sound: true,
        }
      );
    }
    
    return false;
  }

  // Notification d'appel manqué
  static async notifyMissedCall(callerName, callType = 'audio', options = {}) {
    const settings = await StorageService.getSettings();
    
    if (settings.notifications) {
      const callIcon = callType === 'video' ? '📹' : '📞';
      
      return await this.sendLocalNotification(
        `${callIcon} Appel manqué`,
        `${callerName} a tenté de vous appeler`,
        { 
          type: 'missed_call', 
          callType,
          callerId: options.callerId,
          timestamp: Date.now(),
        },
        {
          profilePhoto: options.profilePhoto,
          category: 'virachat-calls',
          sound: true,
        }
      );
    }
    
    return false;
  }

  // Notification de message vocal
  static async notifyVoiceMessage(senderName, conversationId, options = {}) {
    const settings = await StorageService.getSettings();
    
    if (settings.notifications) {
      return await this.sendLocalNotification(
        senderName,
        '🎤 Message vocal',
        { 
          type: 'voice_message', 
          conversationId,
          messageId: options.messageId,
        },
        {
          profilePhoto: options.profilePhoto,
          category: 'virachat-voice',
          sound: true,
        }
      );
    }
    
    return false;
  }

  // Notification de mise à jour de statut
  static async notifyStatusUpdate(userName, status, options = {}) {
    const settings = await StorageService.getSettings();
    
    if (settings.notifications) {
      return await this.sendLocalNotification(
        'Mise à jour de statut',
        `${userName} a mis à jour son statut`,
        { type: 'status_update' },
        {
          profilePhoto: options.profilePhoto,
          category: 'virachat-messages',
          sound: false,
        }
      );
    }
    
    return false;
  }

  // Écouter les notifications reçues
  static addNotificationListener(callback) {
    const subscription = Notifications.addNotificationReceivedListener(callback);
    return subscription;
  }

  // Écouter les réponses aux notifications
  static addNotificationResponseListener(callback) {
    const subscription = Notifications.addNotificationResponseReceivedListener(callback);
    return subscription;
  }

  // Annuler un listener
  static removeListener(subscription) {
    subscription.remove();
  }

  // Obtenir toutes les notifications programmées
  static async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Annuler toutes les notifications programmées
  static async cancelAllScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Définir le badge de l'application
  static async setBadgeNumber(number) {
    await Notifications.setBadgeCountAsync(number);
  }

  // Obtenir le nombre de badges actuel
  static async getBadgeNumber() {
    return await Notifications.getBadgeCountAsync();
  }

  // Effacer le badge
  static async clearBadge() {
    await Notifications.setBadgeCountAsync(0);
  }

  // Annuler une notification spécifique
  static async cancelNotification(notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Obtenir les notifications délivrées
  static async getDeliveredNotifications() {
    return await Notifications.getDeliveredNotificationsAsync();
  }

  // Supprimer toutes les notifications délivrées
  static async removeAllDeliveredNotifications() {
    await Notifications.removeAllDeliveredNotificationsAsync();
  }
}

export default NotificationService;
