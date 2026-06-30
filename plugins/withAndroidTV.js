const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Plugin pour configurer l'application pour Android TV
 * Ajoute les configurations nécessaires pour que l'APK soit compatible Android TV
 */
function withAndroidTV(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    
    // Ajouter la déclaration LEANBACK_LAUNCHER pour Android TV
    const mainActivity = androidManifest.manifest.application[0].activity.find(
      (activity) => activity.$['android:name'] === '.MainActivity'
    );
    
    if (mainActivity) {
      // Ajouter l'intent-filter pour Android TV
      if (!mainActivity['intent-filter']) {
        mainActivity['intent-filter'] = [];
      }
      
      // Vérifier si l'intent-filter LEANBACK_LAUNCHER existe déjà
      const hasLeanbackLauncher = mainActivity['intent-filter'].some(
        (filter) => filter.action && filter.action[0] && filter.action[0].$['android:name'] === 'android.intent.action.LEANBACK_LAUNCHER'
      );
      
      if (!hasLeanbackLauncher) {
        mainActivity['intent-filter'].push({
          action: [
            {
              $: {
                'android:name': 'android.intent.action.LEANBACK_LAUNCHER'
              }
            }
          ],
          category: [
            {
              $: {
                'android:name': 'android.intent.category.LEANBACK_LAUNCHER'
              }
            }
          ]
        });
      }
    }
    
    // Ajouter la fonctionnalité android.software.leanback
    if (!androidManifest.manifest['uses-feature']) {
      androidManifest.manifest['uses-feature'] = [];
    }
    
    const hasLeanbackFeature = androidManifest.manifest['uses-feature'].some(
      (feature) => feature.$ && feature.$['android:name'] === 'android.software.leanback'
    );
    
    if (!hasLeanbackFeature) {
      androidManifest.manifest['uses-feature'].push({
        $: {
          'android:name': 'android.software.leanback',
          'android:required': 'true'
        }
      });
    }
    
    // Ajouter la fonctionnalité touchscreen (non requise pour TV)
    const hasTouchscreenFeature = androidManifest.manifest['uses-feature'].some(
      (feature) => feature.$ && feature.$['android:name'] === 'android.hardware.touchscreen'
    );
    
    if (!hasTouchscreenFeature) {
      androidManifest.manifest['uses-feature'].push({
        $: {
          'android:name': 'android.hardware.touchscreen',
          'android:required': 'false'
        }
      });
    }
    
    // Ajouter la permission pour la télécommande
    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }
    
    const hasRemotePermission = androidManifest.manifest['uses-permission'].some(
      (permission) => permission.$ && permission.$['android:name'] === 'android.permission.RECEIVE_BOOT_COMPLETED'
    );
    
    if (!hasRemotePermission) {
      androidManifest.manifest['uses-permission'].push({
        $: {
          'android:name': 'android.permission.RECEIVE_BOOT_COMPLETED'
        }
      });
    }
    
    return config;
  });
}

module.exports = withAndroidTV;
