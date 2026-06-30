import React, { useState, useRef, useCallback } from 'react';
import { StatusBar, StyleSheet, View, Text, ActivityIndicator, BackHandler, Animated } from 'react-native';
import { WebView } from 'react-native-webview';
import * as SplashScreen from 'expo-splash-screen';
import { useNetInfo } from '@react-native-community/netinfo';

// Empêcher le splash screen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

const VIRACHAT_URL = 'https://vira-chat.base44.app';

// Composant Splash Screen personnalisé
const CustomSplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <StatusBar style="light" backgroundColor="#000f22" />
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>VC</Text>
        </View>
        <Text style={styles.appName}>ViraChat</Text>
        <Text style={styles.tagline}>Messagerie professionnelle</Text>
      </Animated.View>
      <ActivityIndicator style={styles.loadingIndicator} size="large" color="#006d37" />
    </View>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);
  const netInfo = useNetInfo();

  // Gérer le bouton retour Android
  const handleBackPress = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [handleBackPress]);

  // Cacher le splash screen quand le WebView est chargé
  const handleLoadEnd = () => {
    setIsLoading(false);
    SplashScreen.hideAsync();
  };

  // Injecter du code pour améliorer l'expérience offline
  const injectedJavaScript = `
    (function() {
      // Détecter la connexion
      window.addEventListener('offline', () => {
        console.log('Application hors ligne');
        // Afficher un message offline dans l'application web
        document.body.style.opacity = '0.7';
      });
      window.addEventListener('online', () => {
        console.log('Application en ligne');
        document.body.style.opacity = '1';
        // Synchroniser les données
        if (window.navigator.onLine) {
          window.location.reload();
        }
      });
      
      // Améliorer le cache pour le mode offline
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js').catch(err => {
            console.log('Service Worker registration failed:', err);
          });
        });
      }
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <CustomSplashScreen />
      ) : (
        <>
          <StatusBar style="light" backgroundColor="#000f22" />
          <WebView
            ref={webViewRef}
            source={{ uri: VIRACHAT_URL }}
            style={styles.webView}
            originWhitelist={['*']}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={false}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            cacheEnabled={true}
            cacheMode="LOAD_DEFAULT"
            onLoadEnd={handleLoadEnd}
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack);
            }}
            injectedJavaScript={injectedJavaScript}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('HTTP error: ', nativeEvent);
            }}
            // Permissions
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            // Performance
            mixedContentMode="compatibility"
            thirdPartyCookiesEnabled={true}
            // User agent pour s'assurer que le site détecte correctement le mobile
            userAgent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#000f22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#006d37',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#006d37',
    marginTop: 5,
  },
  loadingIndicator: {
    marginTop: 40,
  },
});
