import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';

const BottomMenu = ({ onMenuPress, activeMenu }) => {
  const menuItems = [
    { id: 'program', icon: 'tv', label: 'Programme' },
    { id: 'channel', icon: 'live_tv', label: 'Chaînes' },
    { id: 'list', icon: 'list', label: 'Liste' },
    { id: 'settings', icon: 'settings', label: 'Paramètres' },
  ];

  return (
    <View style={styles.container}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.menuButton, activeMenu === item.id && styles.activeButton]}
          onPress={() => onMenuPress(item.id)}
          activeOpacity={0.7}
        >
          <Icon 
            name={item.icon} 
            size={32} 
            color={activeMenu === item.id ? '#000' : colors.textSecondary}
            style={styles.icon}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

BottomMenu.propTypes = {
  onMenuPress: PropTypes.func.isRequired,
  activeMenu: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 6,
    backgroundColor: colors.surfaceLight,
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  icon: {
    // Icon style
  },
});

export default BottomMenu;
