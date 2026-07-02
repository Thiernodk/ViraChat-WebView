import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';
import platformDetectionService from '../../services/platformDetectionService';

const StatCard = ({ icon, label, value, description }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>
      <Icon name={icon} size={24} color={colors.primary} />
    </View>
    <View style={styles.statTextContainer}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statDescription}>{description}</Text>
    </View>
  </View>
);

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};

const SignalSettingsPanel = ({ onClose, channels, epgData }) => {
  const isTV = platformDetectionService.shouldEnableTVFeatures();
  const [signalInfo, setSignalInfo] = useState({
    totalChannels: 0,
    activeChannels: 0,
    totalEPG: 0,
    signalStrength: 'Excellent',
    lastUpdate: new Date().toLocaleTimeString('fr-FR'),
  });

  useEffect(() => {
    const calculateSignalInfo = () => {
      const totalChannels = channels?.length || 0;
      const activeChannels = channels?.filter(ch => ch.url).length || 0;
      const totalEPG = epgData ? Object.keys(epgData).length : 0;
      
      setSignalInfo({
        totalChannels,
        activeChannels,
        totalEPG,
        signalStrength: 'Excellent',
        lastUpdate: new Date().toLocaleTimeString('fr-FR'),
      });
    };
    calculateSignalInfo();
  }, [channels, epgData]);

  const CloseButton = isTV ? TVFocusable : TouchableOpacity;
  const ActionButton = isTV ? TVFocusable : TouchableOpacity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Signal</Text>
        <CloseButton onPress={onClose} style={styles.closeButton} {...(isTV && { hasTVPreferredFocus: true })}>
          <Icon name="close" size={28} color={colors.text} />
        </CloseButton>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.signalCard}>
          <View style={styles.signalHeader}>
            <Icon name="signal_cellular_4_bar" size={40} color={colors.primary} />
            <View style={styles.signalTextContainer}>
              <Text style={styles.signalLabel}>Force du signal</Text>
              <Text style={[styles.signalValue, { color: colors.primary }]}>{signalInfo.signalStrength}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Statistiques des chaînes</Text>

        <StatCard
          icon="tv"
          label="Chaînes totales"
          value={signalInfo.totalChannels}
          description="Nombre de chaînes disponibles"
        />
        <StatCard
          icon="play_arrow"
          label="Chaînes actives"
          value={signalInfo.activeChannels}
          description="Chaînes avec flux valide"
        />
        <StatCard 
          icon="event" 
          label="Guide EPG" 
          value={signalInfo.totalEPG} 
          description="Chaînes avec données EPG"
        />

        <Text style={styles.sectionTitle}>Dernière mise à jour</Text>
        
        <View style={styles.updateCard}>
          <Icon name="refresh" size={24} color={colors.textSecondary} />
          <Text style={styles.updateTime}>{signalInfo.lastUpdate}</Text>
        </View>

        <ActionButton style={styles.scanButton}>
          <Icon name="search" size={20} color={colors.text} />
          <Text style={styles.scanButtonText}>Scanner les chaînes</Text>
        </ActionButton>
      </ScrollView>
    </View>
  );
};

SignalSettingsPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  channels: PropTypes.array,
  epgData: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 350,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderLeftWidth: 1,
    borderColor: colors.border,
    elevation: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceLight,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  signalCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  signalLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  signalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statDescription: {
    fontSize: 9,
    color: colors.textTertiary,
  },
  updateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  updateTime: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  scanButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SignalSettingsPanel;
