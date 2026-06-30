import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar, BackHandler, TVEventHandler, Text } from 'react-native';
import PropTypes from 'prop-types';
import VideoPlayer from '../components/Player/VideoPlayer';
import ChannelOverlay from '../components/Overlay/ChannelOverlay';
import ChannelListSidebar from '../components/ChannelList/ChannelListSidebar';
import ProgramPanel from '../components/ProgramPanel/ProgramPanel';
import SettingsPanel from '../components/Settings/SettingsPanel';
import DeviceInfoPanel from '../components/DeviceInfo/DeviceInfoPanel';
import NetworkSettingsPanel from '../components/Settings/NetworkSettingsPanel';
import SignalSettingsPanel from '../components/Settings/SignalSettingsPanel';
import AudioSettingsPanel from '../components/Settings/AudioSettingsPanel';
import AboutSettingsPanel from '../components/Settings/AboutSettingsPanel';
import PrivacySettingsPanel from '../components/Settings/PrivacySettingsPanel';
import AccountSettingsPanel from '../components/Settings/AccountSettingsPanel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlayerScreen = ({ channels, epgData }) => {
  const [currentChannel, setCurrentChannel] = useState(channels[0] || null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [quality] = useState('HD');
  const [audioLanguage] = useState('FR');
  const [epgProgress, setEpgProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [channelNumberInput, setChannelNumberInput] = useState('');
  const [showChannelInput, setShowChannelInput] = useState(false);
  const overlayTimeoutRef = useRef(null);
  const tvEventHandler = useRef(null);
  const channelInputTimeoutRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load favorites from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    loadFavorites();
  }, []);

  // Load last channel from AsyncStorage
  useEffect(() => {
    const loadLastChannel = async () => {
      try {
        const storedLastChannel = await AsyncStorage.getItem('lastChannel');
        if (storedLastChannel) {
          const lastChannelId = JSON.parse(storedLastChannel);
          const lastChannel = channels.find(ch => ch.id === lastChannelId);
          if (lastChannel) {
            console.log('[PlayerScreen] Restoring last channel:', lastChannel.name);
            setCurrentChannel(lastChannel);
          }
        }
      } catch (error) {
        console.error('Error loading last channel:', error);
      }
    };
    loadLastChannel();
  }, [channels]);

  // Save favorites to AsyncStorage
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    };
    saveFavorites();
  }, [favorites]);

  // Save last channel to AsyncStorage
  useEffect(() => {
    const saveLastChannel = async () => {
      try {
        if (currentChannel) {
          await AsyncStorage.setItem('lastChannel', JSON.stringify(currentChannel.id));
          console.log('[PlayerScreen] Saved last channel:', currentChannel.name);
        }
      } catch (error) {
        console.error('Error saving last channel:', error);
      }
    };
    saveLastChannel();
  }, [currentChannel]);

  // TV Remote Control Handler
  useEffect(() => {
    // Check if TVEventHandler is available (Android TV only)
    if (typeof TVEventHandler !== 'undefined') {
      tvEventHandler.current = new TVEventHandler();
      tvEventHandler.current.enable(this, (cmp, evt) => {
        console.log('[PlayerScreen] TV Event:', evt);
        
        if (!evt) return;

        // Numeric keys (0-9) for channel input
        if (evt.eventType === 'number' || /^\d$/.test(evt.eventKey)) {
          const digit = evt.eventType === 'number' ? evt.eventNumber : evt.eventKey;
          if (digit && /^\d$/.test(digit)) {
            console.log('[PlayerScreen] Numeric key pressed:', digit);
            setShowChannelInput(true);
            setChannelNumberInput(prev => {
              const newInput = prev + digit;
              // Limit to 4 digits
              return newInput.length > 4 ? newInput.slice(-4) : newInput;
            });
            
            // Reset timeout
            if (channelInputTimeoutRef.current) {
              clearTimeout(channelInputTimeoutRef.current);
            }
            channelInputTimeoutRef.current = setTimeout(() => {
              setShowChannelInput(false);
              setChannelNumberInput('');
            }, 3000);
          }
        }
        // OK / ENTER / DPAD_CENTER - Toggle overlay or switch channel
        else if (evt.eventType === 'select') {
          console.log('[PlayerScreen] OK/ENTER pressed');
          if (showChannelInput && channelNumberInput) {
            // Switch to channel by number
            const targetChannel = channels.find(ch => ch.number === channelNumberInput);
            if (targetChannel) {
              console.log('[PlayerScreen] Switching to channel:', channelNumberInput);
              setCurrentChannel(targetChannel);
              setShowChannelInput(false);
              setChannelNumberInput('');
              setShowOverlay(true);
            } else {
              console.log('[PlayerScreen] Channel not found:', channelNumberInput);
              setShowChannelInput(false);
              setChannelNumberInput('');
            }
          } else {
            setShowOverlay(!showOverlay);
          }
          if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
          }
        }
        // UP - Open Program panel (EPG)
        else if (evt.eventType === 'up') {
          console.log('[PlayerScreen] UP pressed');
          if (showChannelInput) {
            setShowChannelInput(false);
            setChannelNumberInput('');
          } else if (!showOverlay) {
            setShowOverlay(true);
          } else if (activeMenu === 'program') {
            setActiveMenu(null);
          } else {
            setActiveMenu('program');
          }
          if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
          }
        }
        // DOWN - Open Channel list
        else if (evt.eventType === 'down') {
          console.log('[PlayerScreen] DOWN pressed');
          if (showChannelInput) {
            setShowChannelInput(false);
            setChannelNumberInput('');
          } else if (!showOverlay) {
            setShowOverlay(true);
          } else if (activeMenu === 'list') {
            setActiveMenu(null);
          } else {
            setActiveMenu('list');
          }
          if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
          }
        }
        // LEFT - Previous channel or navigation
        else if (evt.eventType === 'left') {
          console.log('[PlayerScreen] LEFT pressed');
          if (showChannelInput) {
            setShowChannelInput(false);
            setChannelNumberInput('');
          } else if (!showOverlay) {
            setShowOverlay(true);
          } else if (activeMenu === null) {
            // Previous channel
            const currentIndex = channels.findIndex(ch => ch.id === currentChannel?.id);
            if (currentIndex > 0) {
              setCurrentChannel(channels[currentIndex - 1]);
            } else {
              setCurrentChannel(channels[channels.length - 1]);
            }
          }
          if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
          }
        }
        // RIGHT - Next channel or navigation
        else if (evt.eventType === 'right') {
          console.log('[PlayerScreen] RIGHT pressed');
          if (showChannelInput) {
            setShowChannelInput(false);
            setChannelNumberInput('');
          } else if (!showOverlay) {
            setShowOverlay(true);
          } else if (activeMenu === null) {
            // Next channel
            const currentIndex = channels.findIndex(ch => ch.id === currentChannel?.id);
            if (currentIndex < channels.length - 1) {
              setCurrentChannel(channels[currentIndex + 1]);
            } else {
              setCurrentChannel(channels[0]);
            }
          }
          if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
          }
        }
        // MENU - Open Settings
        else if (evt.eventType === 'menu') {
          console.log('[PlayerScreen] MENU pressed');
          if (showChannelInput) {
            setShowChannelInput(false);
            setChannelNumberInput('');
          }
          if (activeMenu === 'settings') {
            setActiveMenu(null);
          } else {
            setActiveMenu('settings');
          }
          setShowOverlay(true);
          if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
          }
        }
        // Channel Up (CH+)
        else if (evt.eventKey === 'CHANNEL_UP' || evt.eventType === 'channelUp') {
          console.log('[PlayerScreen] CH+ pressed');
          if (showChannelInput) {
            setShowChannelInput(false);
            setChannelNumberInput('');
          }
          const currentIndex = channels.findIndex(ch => ch.id === currentChannel?.id);
          if (currentIndex < channels.length - 1) {
            setCurrentChannel(channels[currentIndex + 1]);
          } else {
            setCurrentChannel(channels[0]);
          }
          setShowOverlay(true);
          if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
          }
        }
        // Channel Down (CH-)
        else if (evt.eventKey === 'CHANNEL_DOWN' || evt.eventType === 'channelDown') {
          console.log('[PlayerScreen] CH- pressed');
          if (showChannelInput) {
            setShowChannelInput(false);
            setChannelNumberInput('');
          }
          const currentIndex = channels.findIndex(ch => ch.id === currentChannel?.id);
          if (currentIndex > 0) {
            setCurrentChannel(channels[currentIndex - 1]);
          } else {
            setCurrentChannel(channels[channels.length - 1]);
          }
          setShowOverlay(true);
          if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
          }
        }
        // INFO - Open Program panel
        else if (evt.eventType === 'info' || evt.eventKey === 'INFO') {
          console.log('[PlayerScreen] INFO pressed');
          if (showChannelInput) {
            setShowChannelInput(false);
            setChannelNumberInput('');
          }
          setActiveMenu('program');
          setShowOverlay(true);
          if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
          }
        }
        // EXIT - Close all interfaces
        else if (evt.eventType === 'exit' || evt.eventKey === 'EXIT') {
          console.log('[PlayerScreen] EXIT pressed');
          setShowChannelInput(false);
          setChannelNumberInput('');
          setActiveMenu(null);
          setShowOverlay(false);
          if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
          }
        }
      });

      return () => {
        if (tvEventHandler.current) {
          tvEventHandler.current.disable();
        }
        if (channelInputTimeoutRef.current) {
          clearTimeout(channelInputTimeoutRef.current);
        }
      };
    }
  }, [showOverlay, activeMenu, currentChannel, channels, showChannelInput, channelNumberInput]);

  // Auto-hide overlay after 5 seconds
  useEffect(() => {
    if (showOverlay && !activeMenu) {
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
      overlayTimeoutRef.current = setTimeout(() => {
        setShowOverlay(false);
      }, 5000);
    }

    return () => {
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
    };
  }, [showOverlay, activeMenu]);

  // Handle EXIT button (BackHandler)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (activeMenu) {
        setActiveMenu(null);
        setShowOverlay(true);
        return true; // Prevent default back behavior
      } else if (showOverlay) {
        setShowOverlay(false);
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior (exit app)
    });

    return () => backHandler.remove();
  }, [activeMenu, showOverlay]);

  // Simulation de progression EPG - boucle toutes les 30 minutes
  useEffect(() => {
    const updateProgress = () => {
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000; // 30 minutes en millisecondes
      const progress = (now % thirtyMinutes) / thirtyMinutes * 100;
      setEpgProgress(progress);
    };
    
    updateProgress();
    const interval = setInterval(updateProgress, 1000); // Mise à jour chaque seconde
    return () => clearInterval(interval);
  }, []);

  const handleMenuPress = (menuId) => {
    if (activeMenu === menuId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuId);
    }
    setShowOverlay(true);
  };

  const handleScreenTouch = () => {
    setShowOverlay(true);
    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current);
    }
  };

  const handleChannelSelect = (channel) => {
    console.log('[PlayerScreen] Channel selected:', channel.name, channel.url);
    setCurrentChannel(channel);
    setActiveMenu(null);
    setShowOverlay(true);
  };

  const toggleFavorite = (channelId) => {
    if (favorites.includes(channelId)) {
      setFavorites(favorites.filter(id => id !== channelId));
    } else {
      setFavorites([...favorites, channelId]);
    }
  };

  const toggleShowFavorites = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  const getCurrentProgram = () => {
    if (!currentChannel || !epgData[currentChannel.id]) return null;
    return epgData[currentChannel.id].current;
  };

  const getNextProgram = () => {
    if (!currentChannel || !epgData[currentChannel.id]) return null;
    return epgData[currentChannel.id].next;
  };

  const renderActivePanel = () => {
    if (!showOverlay) return null;
    
    switch (activeMenu) {
      case 'program':
        return (
          <ProgramPanel
            currentProgram={getCurrentProgram()}
            nextProgram={getNextProgram()}
          />
        );
      case 'list':
        return (
          <ChannelListSidebar
            channels={channels}
            onChannelSelect={handleChannelSelect}
            currentChannel={currentChannel}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            showFavoritesOnly={showFavoritesOnly}
            onToggleShowFavorites={toggleShowFavorites}
          />
        );
      case 'settings':
        return (
          <SettingsPanel 
            onClose={() => { setActiveMenu(null); setShowOverlay(true); }} 
            onShowDeviceInfo={() => setActiveMenu('device')}
            onShowNetworkSettings={() => setActiveMenu('network')}
            onShowSignalSettings={() => setActiveMenu('signal')}
            onShowAudioSettings={() => setActiveMenu('audio')}
            onShowAboutSettings={() => setActiveMenu('about')}
            onShowPrivacySettings={() => setActiveMenu('privacy')}
            onShowAccountSettings={() => setActiveMenu('account')}
          />
        );
      case 'device':
        return <DeviceInfoPanel onClose={() => { setActiveMenu(null); setShowOverlay(true); }} />;
      case 'network':
        return <NetworkSettingsPanel onClose={() => { setActiveMenu('settings'); setShowOverlay(true); }} />;
      case 'signal':
        return <SignalSettingsPanel onClose={() => { setActiveMenu('settings'); setShowOverlay(true); }} channels={channels} epgData={epgData} />;
      case 'audio':
        return <AudioSettingsPanel onClose={() => { setActiveMenu('settings'); setShowOverlay(true); }} />;
      case 'about':
        return <AboutSettingsPanel onClose={() => { setActiveMenu('settings'); setShowOverlay(true); }} />;
      case 'privacy':
        return <PrivacySettingsPanel onClose={() => { setActiveMenu('settings'); setShowOverlay(true); }} />;
      case 'account':
        return <AccountSettingsPanel onClose={() => { setActiveMenu('settings'); setShowOverlay(true); }} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container} onTouchStart={handleScreenTouch}>
      <StatusBar hidden />
      <VideoPlayer
        source={{ uri: currentChannel?.url }}
        onReady={() => {}}
        onError={(error) => console.error('PlayerScreen: Video error:', error)}
      />
      
      {showChannelInput && (
        <View style={styles.channelInputOverlay}>
          <Text style={styles.channelInputText}>{channelNumberInput}</Text>
        </View>
      )}
      
      {showOverlay && (
        <ChannelOverlay
          channel={currentChannel}
          currentTime={currentTime}
          currentProgram={getCurrentProgram()}
          nextProgram={getNextProgram()}
          progress={epgProgress}
          onMenuPress={handleMenuPress}
          activeMenu={activeMenu}
        />
      )}
      
      {renderActivePanel()}
    </View>
  );
};

PlayerScreen.propTypes = {
  channels: PropTypes.array.isRequired,
  epgData: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  channelInputOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    zIndex: 1000,
  },
  channelInputText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
});

export default PlayerScreen;
