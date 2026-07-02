import { Platform } from 'react-native';

const platformDetectionService = {
  /**
   * Détermine si l'application tourne sur Android TV
   * @returns {boolean} true si Android TV, false sinon
   */
  isAndroidTV: () => {
    if (Platform.OS !== 'android') {
      return false;
    }

    // Vérifier si c'est une TV via les capacités de l'appareil
    try {
      // Sur Android TV, la propriété isTV est disponible
      if (Platform.isTV) {
        return true;
      }

      // Vérifier via les caractéristiques de l'appareil
      const isTelevision = Platform.constants?.systemFeatures?.includes('android.software.leanback');
      if (isTelevision) {
        return true;
      }

      // Vérifier si c'est pas Expo Go (mode développement)
      // En production sur Android TV, ce ne sera pas Expo Go
      const isExpoGo = Platform.constants?.appOwnership === 'expo';
      
      // Si ce n'est pas Expo Go et que c'est Android, on suppose que c'est Android TV
      // pour le build de production
      if (!isExpoGo) {
        return true;
      }
    } catch (error) {
      console.error('[PlatformDetection] Error detecting platform:', error);
    }

    return false;
  },

  /**
   * Détermine si l'application tourne sur Mobile (pas TV)
   * @returns {boolean} true si Mobile, false sinon
   */
  isMobile: () => {
    return !platformDetectionService.isAndroidTV();
  },

  /**
   * Détermine si l'application tourne en mode développement (Expo Go)
   * @returns {boolean} true si Expo Go, false sinon
   */
  isDevelopment: () => {
    return Platform.constants?.appOwnership === 'expo' || __DEV__ === true;
  },

  /**
   * Retourne le type de plateforme actuel
   * @returns {string} 'tv' ou 'mobile'
   */
  getPlatformType: () => {
    return platformDetectionService.isAndroidTV() ? 'tv' : 'mobile';
  },

  /**
   * Détermine si les fonctionnalités TV doivent être activées
   * @returns {boolean} true si fonctionnalités TV activées
   */
  shouldEnableTVFeatures: () => {
    return platformDetectionService.isAndroidTV();
  },
};

export default platformDetectionService;
