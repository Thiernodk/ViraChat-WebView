import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';
import platformDetectionService from '../../services/platformDetectionService';

const ChannelListSidebar = ({ 
  channels, 
  onChannelSelect, 
  currentChannel,
  onClose 
}) => {
  const isTV = platformDetectionService.shouldEnableTVFeatures();
  const flatListRef = useRef(null);

  // Scroll to current channel when it changes
  useEffect(() => {
    if (currentChannel && flatListRef.current) {
      const index = channels.findIndex(ch => ch.id === currentChannel.id);
      if (index >= 0) {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.3,
        });
      }
    }
  }, [currentChannel, channels]);

  const handleChannelSelect = (channel) => {
    onChannelSelect(channel);
    // Auto-close list after selection on TV
    if (isTV && onClose) {
      onClose();
    }
  };

  const renderChannel = ({ item, index }) => {
    const ChannelButton = isTV ? TVFocusable : TouchableOpacity;
    const isSelected = currentChannel?.id === item.id;
    
    return (
      <ChannelButton
        style={[
          styles.channelItem,
          isSelected && styles.selectedChannel
        ]}
        onPress={() => handleChannelSelect(item)}
        {...(isTV && {
          nextFocusUp: index > 0 ? index - 1 : null,
          nextFocusDown: index < channels.length - 1 ? index + 1 : null,
          nextFocusLeft: null,
          nextFocusRight: null,
          hasTVPreferredFocus: index === 0,
        })}
      >
        <Text style={[
          styles.channelNumber,
          isSelected && styles.selectedText
        ]}>{item.number}</Text>
        <Text style={[
          styles.channelName,
          isSelected && styles.selectedText
        ]} numberOfLines={1}>{item.name}</Text>
      </ChannelButton>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={channels}
        renderItem={renderChannel}
        keyExtractor={(item) => item.id}
        style={styles.list}
        initialNumToRender={20}
        getItemLayout={(data, index) => ({
          length: 48,
          offset: 48 * index,
          index,
        })}
      />
    </View>
  );
};

ChannelListSidebar.propTypes = {
  channels: PropTypes.array.isRequired,
  onChannelSelect: PropTypes.func.isRequired,
  currentChannel: PropTypes.object,
  onClose: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    elevation: 30,
  },
  list: {
    flex: 1,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    minHeight: 48,
  },
  selectedChannel: {
    backgroundColor: colors.primary,
  },
  channelNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 16,
    minWidth: 32,
  },
  channelName: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  selectedText: {
    color: '#000000',
  },
});

export default ChannelListSidebar;
