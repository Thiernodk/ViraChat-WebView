import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../theme/colors';

const ProgramPanel = ({ currentProgram, nextProgram }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {currentProgram && (
          <View style={styles.programSection}>
            <Text style={styles.sectionTitle}>Programme Actuel</Text>
            <Text style={styles.programTitle}>{currentProgram.title}</Text>
            <Text style={styles.programTime}>
              {formatDate(currentProgram.startTime)} • {formatTime(currentProgram.startTime)} - {formatTime(currentProgram.endTime)}
            </Text>
            <Text style={styles.programDescription}>{currentProgram.description}</Text>
          </View>
        )}
        
        {nextProgram && (
          <View style={styles.programSection}>
            <Text style={styles.sectionTitle}>Programme Suivant</Text>
            <Text style={styles.programTitle}>{nextProgram.title}</Text>
            <Text style={styles.programTime}>
              {formatDate(nextProgram.startTime)} • {formatTime(nextProgram.startTime)} - {formatTime(nextProgram.endTime)}
            </Text>
            <Text style={styles.programDescription}>{nextProgram.description}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

ProgramPanel.propTypes = {
  currentProgram: PropTypes.object,
  nextProgram: PropTypes.object,
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
  content: {
    flex: 1,
    padding: 16,
  },
  programSection: {
    marginBottom: 24,
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  programTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  programTime: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  programDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default ProgramPanel;
