import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';
import platformDetectionService from '../../services/platformDetectionService';

const NetworkInfoItem = ({ label, value, icon }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIconContainer}>
      <Icon name={icon} size={20} color={colors.primary} />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

NetworkInfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

const NetworkSettingsPanel = ({ onClose }) => {
  const isTV = platformDetectionService.shouldEnableTVFeatures();
  const [networkInfo, setNetworkInfo] = useState({
    ipAddress: '192.168.1.24',
    subnet: '255.255.255.0',
    gateway: '192.168.1.1',
    dns: '192.168.1.1',
    status: 'Connecté',
    type: 'LAN',
    speed: '1000 Mbps',
  });

  useEffect(() => {
    // Simuler la détection réseau
    const detectNetwork = async () => {
      // En production, utiliser une vraie détection réseau
      setNetworkInfo({
        ipAddress: '192.168.1.24',
        subnet: '255.255.255.0',
        gateway: '192.168.1.1',
        dns: '192.168.1.1',
        status: 'Connecté',
        type: 'LAN',
        speed: '1000 Mbps',
      });
    };
    detectNetwork();
  }, []);

  const CloseButton = isTV ? TVFocusable : TouchableOpacity;
  const ActionButton = isTV ? TVFocusable : TouchableOpacity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Réseau</Text>
        <CloseButton onPress={onClose} style={styles.closeButton} {...(isTV && { hasTVPreferredFocus: true })}>
          <Icon name="close" size={28} color={colors.text} />
        </CloseButton>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon name="wifi" size={32} color={colors.primary} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusLabel}>Statut</Text>
              <Text style={[styles.statusValue, { color: colors.primary }]}>{networkInfo.status}</Text>
            </View>
          </View>
          <View style={styles.statusDetails}>
            <View style={styles.statusDetailItem}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{networkInfo.type}</Text>
            </View>
            <View style={styles.statusDetailItem}>
              <Text style={styles.detailLabel}>Vitesse</Text>
              <Text style={styles.detailValue}>{networkInfo.speed}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Configuration IP</Text>
        
        <NetworkInfoItem label="Adresse IP" value={networkInfo.ipAddress} icon="language" />
        <NetworkInfoItem label="Masque de sous-réseau" value={networkInfo.subnet} icon="settings_ethernet" />
        <NetworkInfoItem label="Passerelle" value={networkInfo.gateway} icon="router" />
        <NetworkInfoItem label="DNS" value={networkInfo.dns} icon="dns" />

        <Text style={styles.sectionTitle}>Multicast</Text>
        
        <View style={styles.multicastCard}>
          <View style={styles.multicastHeader}>
            <Icon name="cast" size={24} color={colors.primary} />
            <Text style={styles.multicastTitle}>Support Multicast</Text>
          </View>
          <Text style={styles.multicastStatus}>Activé</Text>
          <Text style={styles.multicastDescription}>
            Le support multicast est activé pour la réception des flux IPTV locaux.
          </Text>
        </View>

        <ActionButton style={styles.refreshButton}>
          <Icon name="refresh" size={20} color={colors.text} />
          <Text style={styles.refreshButtonText}>Actualiser le réseau</Text>
        </ActionButton>
      </ScrollView>
    </View>
  );
};

NetworkSettingsPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
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
  statusCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusDetailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  multicastCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multicastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  multicastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  multicastStatus: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  multicastDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  refreshButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default NetworkSettingsPanel;
