import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import StorageService from './StorageService';

class NotificationService {
  // Configurer les notifications
  static async configure() {
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
      
      // Obtenir le token de push
      const token = await this.getPushToken();
      if (token) {
        await StorageService.saveSettings({ pushToken: token });
        console.log('Push token obtained:', token);
      }
      
      return true;
    }
    
    return false;
  }

  // Obtenir le token de push
  static async getPushToken() {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('virachat-messages', {
          name: 'ViraChat Messages',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#006d37',
        });
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // À remplacer par votre projet ID Expo
      });
      
      return tokenData.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Envoyer une notification locale
  static async sendLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Notification immédiate
      });
      
      return true;
    } catch (error) {
      console.error('Error sending local notification:', error);
      return false;
    }
  }

  // Notification de nouveau message
  static async notifyNewMessage(senderName, message, conversationId) {
    const settings = await StorageService.getSettings();
    
    if (settings.notifications) {
      return await this.sendLocalNotification(
        `Nouveau message de ${senderName}`,
        message,
        { type: 'new_message', conversationId }
      );
    }
    
    return false;
  }

  // Notification d'appel entrant
  static async notifyIncomingCall(callerName, callType = 'audio') {
    const settings = await StorageService.getSettings();
    
    if (settings.notifications) {
      return await this.sendLocalNotification(
        `Appel ${callType} entrant`,
        `${callerName} vous appelle`,
        { type: 'incoming_call', callType }
      );
    }
    
    return false;
  }

  // Notification d'appel manqué
  static async notifyMissedCall(callerName) {
    const settings = await StorageService.getSettings();
    
    if (settings.notifications) {
      return await this.sendLocalNotification(
        'Appel manqué',
        `${callerName} a tenté de vous appeler`,
        { type: 'missed_call' }
      );
    }
    
    return false;
  }

  // Notification de mise à jour de statut
  static async notifyStatusUpdate(userName, status) {
    const settings = await StorageService.getSettings();
    
    if (settings.notifications) {
      return await this.sendLocalNotification(
        'Mise à jour de statut',
        `${userName} a mis à jour son statut`,
        { type: 'status_update' }
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
}

export default NotificationService;
