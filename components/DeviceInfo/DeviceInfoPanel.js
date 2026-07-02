import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Dimensions, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import * as ScreenOrientation from 'expo-screen-orientation';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';
import platformDetectionService from '../../services/platformDetectionService';

const DeviceInfoPanel = ({ onClose }) => {
  const isTV = platformDetectionService.shouldEnableTVFeatures();
  const [deviceInfo, setDeviceInfo] = useState({
    model: '',
    resolution: '',
    screenSize: '',
    density: '',
    orientation: '',
    androidVersion: '',
    expoVersion: '',
    appVersion: '',
  });

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const { width, height } = Dimensions.get('window');
      const scale = Dimensions.get('window').scale;
      const orientation = await ScreenOrientation.getOrientationAsync();
      
      setDeviceInfo({
        model: Platform.constants?.Model || 'Unknown',
        resolution: `${width}x${height}`,
        screenSize: `${(Math.sqrt(width * width + height * height) / scale).toFixed(1)}"`,
        density: `${scale}x`,
        orientation: getOrientationName(orientation),
        androidVersion: Platform.Version,
        expoVersion: Constants.expoVersion,
        appVersion: Constants.manifest?.version || '1.0.0',
      });
    };

    fetchDeviceInfo();
  }, []);

  const getOrientationName = (orientation) => {
    switch (orientation) {
      case ScreenOrientation.Orientation.PORTRAIT_UP:
        return 'Portrait';
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        return 'Paysage (gauche)';
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        return 'Paysage (droite)';
      default:
        return 'Inconnu';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Informations Appareil</Text>
        {(() => {
          const CloseButton = isTV ? TVFocusable : TouchableOpacity;
          return (
            <CloseButton onPress={onClose} style={styles.closeButton} {...(isTV && { hasTVPreferredFocus: true })}>
              <Icon name="close" size={28} color={colors.text} />
            </CloseButton>
          );
        })()}
      </View>
      
      <ScrollView style={styles.content}>
        <InfoItem label="Modèle" value={deviceInfo.model} icon="devices" />
        <InfoItem label="Résolution" value={deviceInfo.resolution} icon="hd" />
        <InfoItem label="Taille écran" value={deviceInfo.screenSize} icon="tv" />
        <InfoItem label="Densité" value={deviceInfo.density} icon="aspect_ratio" />
        <InfoItem label="Orientation" value={deviceInfo.orientation} icon="screen_rotation" />
        <InfoItem label="Version Android" value={deviceInfo.androidVersion} icon="android" />
        <InfoItem label="Version Expo" value={deviceInfo.expoVersion} icon="code" />
        <InfoItem label="Version Application" value={deviceInfo.appVersion} icon="info" />
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <View style={styles.infoItem}>
    <View style={styles.iconContainer}>
      <Icon name={icon} size={24} color={colors.primary} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

DeviceInfoPanel.propTypes = {
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 254, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
});

export default DeviceInfoPanel;
