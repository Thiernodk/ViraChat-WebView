import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../theme/colors';

const EPGProgressBar = ({ currentProgram, nextProgram, progress }) => {
  if (!currentProgram) return null;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.programInfo}>
        <Text style={styles.programTitle}>{currentProgram.title}</Text>
        <Text style={styles.programTime}>
          {formatTime(currentProgram.startTime)} - {formatTime(currentProgram.endTime)}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      {nextProgram && (
        <Text style={styles.nextProgram}>
          À suivre: {nextProgram.title} ({formatTime(nextProgram.startTime)})
        </Text>
      )}
    </View>
  );
};

EPGProgressBar.propTypes = {
  currentProgram: PropTypes.object,
  nextProgram: PropTypes.object,
  progress: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: colors.overlay,
    padding: 16,
    borderRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  programInfo: {
    marginBottom: 12,
  },
  programTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  programTime: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.progressBackground,
    borderRadius: 3,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  nextProgram: {
    fontSize: 13,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
});

export default EPGProgressBar;
