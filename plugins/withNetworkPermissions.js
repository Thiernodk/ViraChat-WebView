const { withAndroidManifest, withInfoPlist } = require('@expo/config-plugins');

// Plugin pour ajouter les permissions réseau Android
const withNetworkPermissionsAndroid = (config) => {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    
    // Ajouter les permissions réseau
    androidManifest.manifest = androidManifest.manifest || {};
    androidManifest.manifest['uses-permission'] = androidManifest.manifest['uses-permission'] || [];
    
    // Ajouter permission INTERNET si elle n'existe pas
    const internetPermission = androidManifest.manifest['uses-permission'].find(
      (perm) => perm.$['android:name'] === 'android.permission.INTERNET'
    );
    
    if (!internetPermission) {
      androidManifest.manifest['uses-permission'].push({
        $: { 'android:name': 'android.permission.INTERNET' }
      });
    }
    
    // Ajouter permission ACCESS_NETWORK_STATE si elle n'existe pas
    const networkStatePermission = androidManifest.manifest['uses-permission'].find(
      (perm) => perm.$['android:name'] === 'android.permission.ACCESS_NETWORK_STATE'
    );
    
    if (!networkStatePermission) {
      androidManifest.manifest['uses-permission'].push({
        $: { 'android:name': 'android.permission.ACCESS_NETWORK_STATE' }
      });
    }
    
    return config;
  });
};

// Plugin pour configurer iOS App Transport Security
const withNetworkPermissionsIOS = (config) => {
  return withInfoPlist(config, (config) => {
    config.modResults.NSAppTransportSecurity = {
      NSAllowsArbitraryLoads: true,
      NSExceptionDomains: {
        'upload.wikimedia.org': {
          NSExceptionAllowsInsecureHTTPLoads: true,
          NSExceptionMinimumTLSVersion: 'TLSv1.0'
        },
        'viamotionhsi.netplus.ch': {
          NSExceptionAllowsInsecureHTTPLoads: true,
          NSExceptionMinimumTLSVersion: 'TLSv1.0'
        },
        'live.france24.com': {
          NSExceptionAllowsInsecureHTTPLoads: true,
          NSExceptionMinimumTLSVersion: 'TLSv1.0'
        },
        'live-hls-web-aje.getaj.net': {
          NSExceptionAllowsInsecureHTTPLoads: true,
          NSExceptionMinimumTLSVersion: 'TLSv1.0'
        }
      }
    };
    
    return config;
  });
};

module.exports = (config) => {
  config = withNetworkPermissionsAndroid(config);
  config = withNetworkPermissionsIOS(config);
  return config;
};
