import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Détection de l'appareil
const isTV = width >= 1280;
const isTablet = width >= 768 && width < 1280;

// Calculer les données
const deviceType = isTV ? "TV" : isTablet ? "Tablette" : "Mobile";
const scale = isTV ? 1 : isTablet ? 0.75 : 0.5;

const DeviceInfo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informations appareil</Text>
      <Text style={styles.item}>Type d&apos;appareil :</Text>
      <Text style={styles.value}>{deviceType}</Text>
      
      <Text style={styles.item}>Résolution écran :</Text>
      <Text style={styles.value}>{width} x {height}</Text>
      
      <Text style={styles.item}>Résolution cible TV :</Text>
      <Text style={styles.value}>1280 x 720</Text>
      
      <Text style={styles.item}>Échelle actuelle :</Text>
      <Text style={styles.value}>{scale}x</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    color: '#00fe66',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  item: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    color: '#00fe66',
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DeviceInfo;
