import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import SoundService from '../services/SoundService';
import { MaterialIcons } from '@expo/vector-icons';

const CallScreen = ({ callData, onEndCall, onMute, onSpeaker, onVideoToggle }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callData.callType === 'video');
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // Démarrer le timer de durée d'appel
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (onMute) {
      onMute(!isMuted);
    }
  };

  const handleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
    if (onSpeaker) {
      onSpeaker(!isSpeaker);
    }
  };

  const handleVideoToggle = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (onVideoToggle) {
      onVideoToggle(!isVideoEnabled);
    }
  };

  const handleEndCall = () => {
    SoundService.playCallEnded();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (onEndCall) {
      onEndCall(callData);
    }
  };

  const callIcon = callData.callType === 'video' ? 'videocam' : 'phone';
  const callTypeText = callData.callType === 'video' ? 'Appel vidéo' : 'Appel vocal';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000f22" />
      
      {/* Photo de profil / Vidéo */}
      <View style={styles.videoContainer}>
        {isVideoEnabled ? (
          <View style={styles.videoPlaceholder}>
            <MaterialIcons name="videocam-off" size={64} color="#ffffff" />
            <Text style={styles.videoPlaceholderText}>Vidéo en cours...</Text>
          </View>
        ) : (
          <>
            {callData.profilePhoto ? (
              <Image source={{ uri: callData.profilePhoto }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <MaterialIcons name="person" size={80} color="#ffffff" />
              </View>
            )}
          </>
        )}
      </View>

      {/* Informations de l'appel */}
      <View style={styles.infoContainer}>
        <Text style={styles.callerName}>{callData.callerName || 'Inconnu'}</Text>
        <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
      </View>

      {/* Contrôles d'appel */}
      <View style={styles.controlsContainer}>
        {/* Bouton Muet */}
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.controlButtonActive]} 
          onPress={handleMute}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name={isMuted ? "mic-off" : "mic"} 
            size={24} 
            color={isMuted ? "#ff4444" : "#ffffff"} 
          />
          <Text style={styles.controlButtonText}>Muet</Text>
        </TouchableOpacity>

        {/* Bouton Haut-parleur */}
        <TouchableOpacity 
          style={[styles.controlButton, isSpeaker && styles.controlButtonActive]} 
          onPress={handleSpeaker}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name={isSpeaker ? "volume-up" : "volume-down"} 
            size={24} 
            color={isSpeaker ? "#006d37" : "#ffffff"} 
          />
          <Text style={styles.controlButtonText}>Haut-parleur</Text>
        </TouchableOpacity>

        {/* Bouton Vidéo (si appel vidéo) */}
        {callData.callType === 'video' && (
          <TouchableOpacity 
            style={[styles.controlButton, !isVideoEnabled && styles.controlButtonActive]} 
            onPress={handleVideoToggle}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name={isVideoEnabled ? "videocam" : "videocam-off"} 
              size={24} 
              color={!isVideoEnabled ? "#ff4444" : "#ffffff"} 
            />
            <Text style={styles.controlButtonText}>Vidéo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bouton Raccrocher */}
      <View style={styles.endCallContainer}>
        <TouchableOpacity 
          style={styles.endCallButton} 
          onPress={handleEndCall}
          activeOpacity={0.7}
        >
          <MaterialIcons name="call-end" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000f22',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  profilePhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#006d37',
  },
  profilePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#006d37',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  callerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  callDuration: {
    fontSize: 18,
    color: '#006d37',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 8,
  },
  endCallContainer: {
    marginBottom: 40,
  },
  endCallButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default CallScreen;
