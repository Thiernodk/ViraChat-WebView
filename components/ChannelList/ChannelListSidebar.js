import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import TVFocusable from '../TVFocusable/TVFocusable';
import platformDetectionService from '../../services/platformDetectionService';

const ChannelListSidebar = ({ 
  channels, 
  onChannelSelect, 
  currentChannel, 
  favorites, 
  onToggleFavorite, 
  showFavoritesOnly, 
  onToggleShowFavorites 
}) => {
  const isTV = platformDetectionService.shouldEnableTVFeatures();
  const [searchQuery, setSearchQuery] = useState('');
  const flatListRef = useRef(null);

  // Scroll to current channel when it changes
  useEffect(() => {
    if (currentChannel && flatListRef.current) {
      const index = filteredChannels.findIndex(ch => ch.id === currentChannel.id);
      if (index >= 0) {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.3,
        });
      }
    }
  }, [currentChannel, filteredChannels]);

  const filteredChannels = channels.filter((channel) => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = showFavoritesOnly ? favorites.includes(channel.id) : true;
    return matchesSearch && matchesFavorites;
  });

  const renderChannel = ({ item, index }) => {
    const ChannelButton = isTV ? TVFocusable : TouchableOpacity;
    
    return (
      <ChannelButton
        style={[styles.channelItem, currentChannel?.id === item.id && styles.selectedChannel]}
        onPress={() => onChannelSelect(item)}
        {...(isTV && {
          nextFocusUp: index > 0 ? index - 1 : 0,
          nextFocusDown: index < filteredChannels.length - 1 ? index + 1 : filteredChannels.length - 1,
          hasTVPreferredFocus: index === 0,
        })}
      >
        <View style={styles.channelInfoRow}>
          <Text style={styles.channelNumber}>{item.number}</Text>
          <Image source={{ uri: item.logo }} style={styles.channelLogo} />
          <Text style={styles.channelName} numberOfLines={1}>{item.name}</Text>
        </View>
        <ChannelButton
          onPress={() => onToggleFavorite(item.id)}
          style={styles.favoriteButton}
          {...(isTV && {
            nextFocusLeft: index,
            nextFocusRight: null,
          })}
        >
          <Icon 
            name={favorites.includes(item.id) ? 'favorite' : 'star_border'} 
            size={20} 
            color={favorites.includes(item.id) ? colors.primary : 'rgba(255, 255, 255, 0.5)'}
          />
        </ChannelButton>
      </ChannelButton>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chaînes</Text>
        {isTV ? (
          <TVFocusable
            style={[styles.headerFilterButton, showFavoritesOnly && styles.filterButtonActive]}
            onPress={onToggleShowFavorites}
            hasTVPreferredFocus={true}
          >
            <Icon 
              name={showFavoritesOnly ? 'favorite' : 'star_border'} 
              size={18} 
              color={showFavoritesOnly ? colors.primary : 'rgba(255, 255, 255, 0.5)'}
            />
          </TVFocusable>
        ) : (
          <TouchableOpacity
            style={[styles.headerFilterButton, showFavoritesOnly && styles.filterButtonActive]}
            onPress={onToggleShowFavorites}
          >
            <Icon 
              name={showFavoritesOnly ? 'favorite' : 'star_border'} 
              size={18} 
              color={showFavoritesOnly ? colors.primary : 'rgba(255, 255, 255, 0.5)'}
            />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        ref={flatListRef}
        data={filteredChannels}
        renderItem={renderChannel}
        keyExtractor={(item) => item.id}
        style={styles.list}
        initialNumToRender={20}
        getItemLayout={(data, index) => ({
          length: 56,
          offset: 56 * index,
          index,
        })}
      />
      
      <View style={styles.remoteHints}>
        <View style={styles.hintItem}>
          <View style={styles.hintKey}>
            <Text style={styles.hintKeyText}>OK</Text>
          </View>
          <Text style={styles.hintText}>Sélectionner</Text>
        </View>
        <View style={styles.hintItem}>
          <View style={styles.hintKey}>
            <Text style={styles.hintKeyText}>EXIT</Text>
          </View>
          <Text style={styles.hintText}>Sortie</Text>
        </View>
        <View style={styles.hintItem}>
          <View style={styles.hintKey}>
            <Text style={styles.hintKeyText}>MENU</Text>
          </View>
          <Text style={styles.hintText}>Menu</Text>
        </View>
        <View style={styles.hintItem}>
          <View style={styles.hintKey}>
            <Text style={styles.hintKeyText}>⬅</Text>
          </View>
          <Text style={styles.hintText}>Retour</Text>
        </View>
      </View>
    </View>
  );
};

ChannelListSidebar.propTypes = {
  channels: PropTypes.array.isRequired,
  onChannelSelect: PropTypes.func.isRequired,
  currentChannel: PropTypes.object,
  favorites: PropTypes.array.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  showFavoritesOnly: PropTypes.bool.isRequired,
  onToggleShowFavorites: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 320,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRightWidth: 1,
    borderColor: colors.border,
    elevation: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.surfaceLight,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerFilterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerFilterButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 10,
    marginLeft: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    margin: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    marginHorizontal: 8,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 6,
  },
  filterButtonTextActive: {
    color: '#000',
  },
  list: {
    flex: 1,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    borderBottomWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
  },
  selectedChannel: {
    backgroundColor: 'rgba(0, 254, 102, 0.2)',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  channelInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  channelNumber: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 4,
    minWidth: 24,
  },
  channelLogo: {
    width: 40,
    height: 25,
    resizeMode: 'contain',
    marginRight: 6,
  },
  channelName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 4,
  },
  remoteHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: colors.surfaceLight,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  hintItem: {
    alignItems: 'center',
  },
  hintKey: {
    width: 26,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  hintKeyText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
  },
  hintText: {
    fontSize: 8,
    color: '#FFFFFF',
  },
});

export default ChannelListSidebar;
