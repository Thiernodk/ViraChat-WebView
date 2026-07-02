import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import subscriptionService from '../../services/subscriptionService';
import TVFocusable from '../TVFocusable/TVFocusable';
import platformDetectionService from '../../services/platformDetectionService';

const ChannelOverlay = ({ channel, currentTime, currentProgram, nextProgram, progress, onMenuPress, activeMenu }) => {
  const isTV = platformDetectionService.shouldEnableTVFeatures();
  if (!channel) return null;

  const [daysUntilExpiration, setDaysUntilExpiration] = useState(null);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    const days = await subscriptionService.getDaysUntilExpiration();
    setDaysUntilExpiration(days);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const showJ5Warning = daysUntilExpiration === 5;
  const showJ1Warning = daysUntilExpiration === 1;

  return (
    <View style={styles.container}>
      {/* Header avec logo, nom de chaîne, programme en cours et heure sur la même ligne */}
      <View style={styles.header}>
        <View style={styles.channelInfo}>
          <Image
            source={{ uri: channel.logo }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.channelName}>{channel.name}</Text>
        </View>
        
        {/* Programme en cours au centre */}
        {currentProgram ? (
          <Text style={styles.programName}>{currentProgram.title}</Text>
        ) : (
          <Text style={styles.programName}>PROGRAMME NON DISPONIBLE</Text>
        )}
        
        <View style={styles.timeContainer}>
          <Icon name="schedule" size={20} color="#FFFFFF" />
          <Text style={styles.time}>{currentTime}</Text>
        </View>
      </View>

      {/* Alertes d'abonnement */}
      {showJ5Warning && (
        <View style={styles.warningContainer}>
          <Icon name="warning" size={16} color="#FFA500" />
          <Text style={styles.warningText}>J-5: Votre abonnement expire dans 5 jours</Text>
        </View>
      )}
      {showJ1Warning && (
        <View style={[styles.warningContainer, styles.warningCritical]}>
          <Icon name="warning" size={16} color="#FF0000" />
          <Text style={[styles.warningText, styles.warningCriticalText]}>J-1: Votre abonnement expire demain</Text>
        </View>
      )}

      {/* Barre de progression EPG */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Programme à suivre */}
      {nextProgram && (
        <View style={styles.nextProgramContainer}>
          <Text style={styles.nextProgramLabel}>À suivre:</Text>
          <Text style={styles.nextProgramTitle}>
            {nextProgram.title} ({formatTime(nextProgram.startTime)})
          </Text>
        </View>
      )}

      {/* Icônes de contrôle */}
      <View style={styles.iconContainer}>
        {(() => {
          const IconButton = isTV ? TVFocusable : TouchableOpacity;
          return (
            <>
              <IconButton 
                style={[styles.iconButton, activeMenu === 'program' && styles.activeButton]}
                onPress={() => onMenuPress && onMenuPress('program')}
                {...(isTV && {
                  nextFocusRight: 1,
                  hasTVPreferredFocus: true,
                })}
              >
                <Icon name="tv" size={32} color={activeMenu === 'program' ? '#000' : colors.textSecondary} />
              </IconButton>
              <IconButton 
                style={[styles.iconButton, activeMenu === 'list' && styles.activeButton]}
                onPress={() => onMenuPress && onMenuPress('list')}
                {...(isTV && {
                  nextFocusLeft: 0,
                  nextFocusRight: 2,
                })}
              >
                <Icon name="list" size={32} color={activeMenu === 'list' ? '#000' : colors.textSecondary} />
              </IconButton>
              <IconButton 
                style={[styles.iconButton, activeMenu === 'settings' && styles.activeButton]}
                onPress={() => onMenuPress && onMenuPress('settings')}
                {...(isTV && {
                  nextFocusLeft: 1,
                })}
              >
                <Icon name="settings" size={32} color={activeMenu === 'settings' ? '#000' : colors.textSecondary} />
              </IconButton>
            </>
          );
        })()}
      </View>
    </View>
  );
};

ChannelOverlay.propTypes = {
  channel: PropTypes.object,
  currentTime: PropTypes.string,
  currentProgram: PropTypes.object,
  nextProgram: PropTypes.object,
  progress: PropTypes.number,
  onMenuPress: PropTypes.func,
  activeMenu: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    elevation: 30,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0,
  },
  logo: {
    width: 50,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10,
  },
  channelDetails: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  programName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  time: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  nextProgramContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  nextProgramLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    fontStyle: 'italic',
    marginRight: 5,
  },
  nextProgramTitle: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
  },
  progressContainer: {
    marginBottom: 10,
    width: '60%',
    alignSelf: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00FE66',
    borderRadius: 3,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  iconButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: colors.surfaceLight,
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 165, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  warningCritical: {
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    borderColor: '#FF0000',
  },
  warningText: {
    fontSize: 12,
    color: '#FFA500',
    fontWeight: '600',
    marginLeft: 6,
  },
  warningCriticalText: {
    color: '#FF0000',
  },
});

export default ChannelOverlay;
