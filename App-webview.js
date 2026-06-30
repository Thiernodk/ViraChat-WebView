import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StatusBar, StyleSheet, View, Text, ActivityIndicator, BackHandler, AppState } from 'react-native';
import { WebView } from 'react-native-webview';
import * as SplashScreen from 'expo-splash-screen';
import { useNetInfo } from '@react-native-community/netinfo';
import StorageService from './services/StorageService';
import CookieService from './services/CookieManager';
import MessageStatusService from './services/MessageStatusService';
import NotificationService from './services/NotificationService';
import SoundService from './services/SoundService';

// Empêcher le splash screen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

const VIRACHAT_URL = 'https://vira-chat.base44.app';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);
  const netInfo = useNetInfo();
  const appState = useRef(AppState.currentState);

  // Initialiser les services au démarrage
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialiser le stockage
        await StorageService.getSettings();
        
        // Initialiser les notifications
        await NotificationService.configure();
        
        // Initialiser les sons
        await SoundService.loadDefaultSounds();
        
        // Restaurer la session
        const session = await CookieService.getSession();
        if (session) {
          console.log('Session restored:', session.url);
        }
        
        // Marquer l'utilisateur comme en ligne
        await MessageStatusService.setCurrentUserOnline();
        
        console.log('All services initialized successfully');
      } catch (error) {
        console.error('Error initializing services:', error);
      }
    };
    
    initializeServices();
  }, []);

  // Gérer les changements d'état de l'application (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App came to foreground');
        MessageStatusService.setCurrentUserOnline();
        SoundService.initialize();
      } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        console.log('App went to background');
        MessageStatusService.setCurrentUserOffline();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Restaurer la session au démarrage
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const session = await CookieService.getSession();
        if (session) {
          console.log('Session restored:', session.url);
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      }
    };
    restoreSession();
  }, []);

  // Gérer le bouton retour Android
  const handleBackPress = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [handleBackPress]);

  // Cacher le splash screen quand le WebView est chargé
  const handleLoadEnd = () => {
    console.log('WebView loaded successfully');
    setIsLoading(false);
    SplashScreen.hideAsync();
    // Sauvegarder la session après chargement réussi
    CookieService.saveSession(VIRACHAT_URL);
  };

  // Gérer les erreurs du WebView
  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
    setIsLoading(false);
    SplashScreen.hideAsync();
  };

  const handleHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('HTTP error: ', nativeEvent);
    setIsLoading(false);
    SplashScreen.hideAsync();
  };

  // Injecter du code pour améliorer l'expérience offline et la synchronisation
  const injectedJavaScript = `
    (function() {
      // Détecter la connexion
      window.addEventListener('offline', () => {
        console.log('Application hors ligne');
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'OFFLINE',
            data: { timestamp: Date.now() }
          }));
        }
      });
      
      window.addEventListener('online', () => {
        console.log('Application en ligne');
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'ONLINE',
            data: { timestamp: Date.now() }
          }));
        }
      });
      
      // Intercepter les messages pour la file d'attente offline
      const originalSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function(data) {
        if (!navigator.onLine) {
          console.log('Message mis en file d attente (offline)');
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'QUEUE_MESSAGE',
              data: { payload: data, timestamp: Date.now() }
            }));
          }
        }
        return originalSend.apply(this, arguments);
      };
      
      // Améliorer le cache pour le mode offline
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js').catch(err => {
            console.log('Service Worker registration failed:', err);
          });
        });
      }
      
      // Indicateur de présence
      window.addEventListener('focus', () => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'APP_FOCUSED',
            data: { timestamp: Date.now() }
          }));
        }
      });
      
      window.addEventListener('blur', () => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'APP_BLURRED',
            data: { timestamp: Date.now() }
          }));
        }
      });
      
      // Écouter les événements de messages (pour les accusés de réception, etc.)
      document.addEventListener('messageReceived', (event) => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'MESSAGE_RECEIVED',
            data: event.detail
          }));
        }
      });
      
      document.addEventListener('messageSent', (event) => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'MESSAGE_SENT',
            data: event.detail
          }));
        }
      });
      
      document.addEventListener('typingIndicator', (event) => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'TYPING_INDICATOR',
            data: event.detail
          }));
        }
      });
    })();
    true;
  `;

  // Gérer les messages provenant du WebView
  const handleMessage = async (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log('Message from WebView:', message);
      
      switch (message.type) {
        case 'OFFLINE':
          console.log('User went offline');
          await MessageStatusService.setCurrentUserOffline();
          break;
        case 'ONLINE':
          console.log('User came online - triggering sync');
          await MessageStatusService.setCurrentUserOnline();
          await syncOfflineQueue();
          break;
        case 'QUEUE_MESSAGE':
          console.log('Message queued for offline sending:', message.data);
          await StorageService.addToOfflineQueue(message.data);
          break;
        case 'APP_FOCUSED':
          console.log('App focused');
          await MessageStatusService.setCurrentUserOnline();
          break;
        case 'APP_BLURRED':
          console.log('App blurred');
          await MessageStatusService.setCurrentUserOffline();
          break;
        case 'MESSAGE_RECEIVED':
          console.log('New message received:', message.data);
          await SoundService.playMessageReceived();
          await SoundService.vibrateForMessage();
          if (message.data.senderName) {
            await NotificationService.notifyNewMessage(
              message.data.senderName,
              message.data.message || 'Nouveau message',
              message.data.conversationId
            );
          }
          break;
        case 'MESSAGE_SENT':
          console.log('Message sent:', message.data);
          await SoundService.playMessageSent();
          break;
        case 'TYPING_INDICATOR':
          console.log('Typing indicator:', message.data);
          await MessageStatusService.setTypingIndicator(
            message.data.conversationId,
            message.data.userId,
            message.data.isTyping
          );
          break;
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  // Synchroniser les données quand la connexion revient
  useEffect(() => {
    if (netInfo.isConnected && netInfo.isInternetReachable) {
      console.log('Connection restored - syncing offline queue');
      syncOfflineQueue();
    }
  }, [netInfo.isConnected, netInfo.isInternetReachable]);

  const syncOfflineQueue = async () => {
    try {
      const queue = await StorageService.getOfflineQueue();
      if (queue.length > 0) {
        console.log(`Syncing ${queue.length} offline messages`);
        // Envoyer les messages en attente
        // Cette logique sera implémentée côté serveur ou via l'API web
        await StorageService.clearOfflineQueue();
      }
    } catch (error) {
      console.error('Error syncing offline queue:', error);
    }
  };

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      MessageStatusService.setCurrentUserOffline();
      SoundService.cleanup();
    };
  }, []);

  return (
    <View style={styles.container}>
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
        onLoadStart={() => console.log('WebView loading started')}
        onLoadEnd={handleLoadEnd}
        onNavigationStateChange={(navState) => {
          console.log('Navigation state changed:', navState);
          setCanGoBack(navState.canGoBack);
        }}
        onMessage={handleMessage}
        injectedJavaScript={injectedJavaScript}
        onError={handleError}
        onHttpError={handleHttpError}
        // Permissions
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        // Performance
        mixedContentMode="compatibility"
        thirdPartyCookiesEnabled={true}
        // User agent pour s'assurer que le site détecte correctement le mobile
        userAgent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#006d37" />
            <Text style={styles.loadingText}>Chargement de ViraChat...</Text>
          </View>
        )}
        renderError={(errorName) => (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Erreur de chargement</Text>
            <Text style={styles.errorText}>{errorName}</Text>
            <Text style={styles.errorUrl}>{VIRACHAT_URL}</Text>
          </View>
        )}
      />
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000f22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorUrl: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
