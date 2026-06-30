import React from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const EPGTimeline = ({ programs, onProgramSelect }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView style={styles.container} horizontal showsHorizontalScrollIndicator={false}>
      {programs.map((program, index) => (
        <TouchableOpacity
          key={index}
          style={styles.programItem}
          onPress={() => onProgramSelect(program)}
        >
          <Text style={styles.programTime}>{formatTime(program.startTime)}</Text>
          <Text style={styles.programTitle} numberOfLines={2}>
            {program.title}
          </Text>
          <Text style={styles.programDescription} numberOfLines={3}>
            {program.description}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

EPGTimeline.propTypes = {
  programs: PropTypes.array.isRequired,
  onProgramSelect: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  programItem: {
    width: 200,
    backgroundColor: 'rgba(30,30,30,0.95)',
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  programTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 8,
  },
  programTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  programDescription: {
    fontSize: 12,
    color: '#CCC',
  },
});

export default EPGTimeline;
