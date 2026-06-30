import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, AppState, StatusBar } from 'react-native';
import SoundService from '../services/SoundService';
import NotificationService from '../services/NotificationService';
import { MaterialIcons } from '@expo/vector-icons';

const IncomingCallScreen = ({ callData, onAnswer, onReject }) => {
  const [isRinging, setIsRinging] = useState(true);
  const [callerInfo, setCallerInfo] = useState({
    name: callData.callerName || 'Inconnu',
    photo: callData.profilePhoto || null,
    callType: callData.callType || 'audio',
  });

  useEffect(() => {
    // Démarrer la sonnerie
    SoundService.playIncomingCall();
    
    // Vibration continue pendant l'appel
    const vibrationInterval = setInterval(() => {
      SoundService.vibrateForCall();
    }, 2000);

    // Nettoyer quand le composant est démonté
    return () => {
      clearInterval(vibrationInterval);
      SoundService.stopAllSounds();
    };
  }, []);

  const handleAnswer = () => {
    setIsRinging(false);
    SoundService.stopAllSounds();
    if (onAnswer) {
      onAnswer(callData);
    }
  };

  const handleReject = () => {
    setIsRinging(false);
    SoundService.stopAllSounds();
    if (onReject) {
      onReject(callData);
    }
  };

  const callIcon = callerInfo.callType === 'video' ? 'videocam' : 'phone';
  const callTypeText = callerInfo.callType === 'video' ? 'Appel vidéo' : 'Appel vocal';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000f22" />
      
      {/* Photo de profil */}
      <View style={styles.profileContainer}>
        {callerInfo.photo ? (
          <Image source={{ uri: callerInfo.photo }} style={styles.profilePhoto} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <MaterialIcons name="person" size={80} color="#ffffff" />
          </View>
        )}
        
        {/* Indicateur d'appel */}
        <View style={styles.callIndicator}>
          <MaterialIcons name={callIcon} size={32} color="#ffffff" />
        </View>
      </View>

      {/* Informations de l'appelant */}
      <View style={styles.infoContainer}>
        <Text style={styles.callerName}>{callerInfo.name}</Text>
        <Text style={styles.callType}>{callTypeText} entrant...</Text>
        {isRinging && (
          <View style={styles.ringingContainer}>
            <View style={[styles.ringingDot, styles.ringingDot1]} />
            <View style={[styles.ringingDot, styles.ringingDot2]} />
            <View style={[styles.ringingDot, styles.ringingDot3]} />
          </View>
        )}
      </View>

      {/* Boutons d'action */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]} 
          onPress={handleReject}
          activeOpacity={0.7}
        >
          <MaterialIcons name="call-end" size={32} color="#ffffff" />
          <Text style={styles.actionButtonText}>Refuser</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.answerButton]} 
          onPress={handleAnswer}
          activeOpacity={0.7}
        >
          <MaterialIcons name="call" size={32} color="#ffffff" />
          <Text style={styles.actionButtonText}>Décrocher</Text>
        </TouchableOpacity>
      </View>

      {/* Message optionnel */}
      {callData.message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{callData.message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000f22',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#006d37',
  },
  profilePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#006d37',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  callIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#006d37',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  callerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  callType: {
    fontSize: 18,
    color: '#006d37',
    marginBottom: 20,
  },
  ringingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ringingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#006d37',
    marginHorizontal: 4,
  },
  ringingDot1: {
    opacity: 1,
  },
  ringingDot2: {
    opacity: 0.5,
  },
  ringingDot3: {
    opacity: 0.2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  rejectButton: {
    backgroundColor: '#ff4444',
  },
  answerButton: {
    backgroundColor: '#006d37',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  messageContainer: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default IncomingCallScreen;
