import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Écran des Réglages</Text>
      <Text style={styles.subtitle}>Cet écran sera implémenté ultérieurement</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAA',
  },
});

export default SettingsScreen;
