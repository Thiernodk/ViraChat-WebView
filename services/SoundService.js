import { Audio } from 'expo-av';
import StorageService from './StorageService';

class SoundService {
  static sounds = {};
  static isInitialized = false;

  // Initialiser le module audio
  static async initialize() {
    if (this.isInitialized) {
      return true;
    }

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing audio:', error);
      return false;
    }
  }

  // Charger un son
  static async loadSound(soundName, soundFile) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: soundFile },
        { shouldPlay: false }
      );
      this.sounds[soundName] = sound;
      return true;
    } catch (error) {
      console.error(`Error loading sound ${soundName}:`, error);
      return false;
    }
  }

  // Jouer un son
  static async playSound(soundName) {
    try {
      const settings = await StorageService.getSettings();
      
      if (!settings.sound) {
        return false; // Son désactivé dans les paramètres
      }

      const sound = this.sounds[soundName];
      if (sound) {
        await sound.replayAsync();
        return true;
      }

      console.warn(`Sound ${soundName} not loaded`);
      return false;
    } catch (error) {
      console.error(`Error playing sound ${soundName}:`, error);
      return false;
    }
  }

  // Son de message reçu
  static async playMessageReceived() {
    return await this.playSound('message_received');
  }

  // Son de message envoyé
  static async playMessageSent() {
    return await this.playSound('message_sent');
  }

  // Son d'appel entrant
  static async playIncomingCall() {
    return await this.playSound('incoming_call');
  }

  // Son d'appel sortant
  static async playOutgoingCall() {
    return await this.playSound('outgoing_call');
  }

  // Son d'appel terminé
  static async playCallEnded() {
    return await this.playSound('call_ended');
  }

  // Son de notification
  static async playNotification() {
    return await this.playSound('notification');
  }

  // Son de vibration (sur mobile)
  static async vibrate(pattern = [200]) {
    try {
      const settings = await StorageService.getSettings();
      
      if (settings.vibration) {
        // Expo n'a pas d'API vibration directe, mais on peut utiliser Haptics
        const { Haptics } = await import('expo-haptics');
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.error('Error vibrating:', error);
    }
  }

  // Vibration pour message reçu
  static async vibrateForMessage() {
    await this.vibrate([50, 50, 50]);
  }

  // Vibration pour appel
  static async vibrateForCall() {
    await this.vibrate([500, 200, 500]);
  }

  // Arrêter tous les sons
  static async stopAllSounds() {
    try {
      for (const sound of Object.values(this.sounds)) {
        await sound.stopAsync();
      }
      return true;
    } catch (error) {
      console.error('Error stopping sounds:', error);
      return false;
    }
  }

  // Libérer les ressources audio
  static async cleanup() {
    try {
      await this.stopAllSounds();
      for (const sound of Object.values(this.sounds)) {
        await sound.unloadAsync();
      }
      this.sounds = {};
      this.isInitialized = false;
      return true;
    } catch (error) {
      console.error('Error cleaning up sounds:', error);
      return false;
    }
  }

  // Charger les sons par défaut (avec des sons système)
  static async loadDefaultSounds() {
    await this.initialize();

    // Utiliser des sons système par défaut
    // Dans une vraie application, vous utiliseriez vos propres fichiers audio
    const defaultSounds = {
      message_received: 'default',
      message_sent: 'default',
      incoming_call: 'default',
      outgoing_call: 'default',
      call_ended: 'default',
      notification: 'default',
    };

    // Pour l'instant, nous utilisons des sons système
    // Plus tard, vous pouvez remplacer par des fichiers audio personnalisés
    console.log('Default sounds loaded (using system sounds)');
    return true;
  }
}

export default SoundService;
