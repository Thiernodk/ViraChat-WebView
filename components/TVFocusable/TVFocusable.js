import React from 'react';
import { Pressable, StyleSheet, Animated, View, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import platformDetectionService from '../../services/platformDetectionService';

const TVFocusable = ({
  children,
  onPress,
  style,
  focusedStyle,
  nextFocusUp,
  nextFocusDown,
  nextFocusLeft,
  nextFocusRight,
  hasTVPreferredFocus,
  isTVSelectable,
  ...props
}) => {
  const isTV = platformDetectionService.shouldEnableTVFeatures();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const borderAnim = React.useRef(new Animated.Value(0)).current;
  const shadowAnim = React.useRef(new Animated.Value(0)).current;
  const elevationAnim = React.useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    if (!isTV) return; // Pas d'animation de focus sur mobile
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1.08,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(elevationAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = () => {
    if (!isTV) return; // Pas d'animation de focus sur mobile
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(elevationAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressIn = () => {
    if (isTV) {
      // Animation de press sur TV
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
    // Sur mobile, comportement tactile par défaut de Pressable
  };

  const handlePressOut = () => {
    if (isTV) {
      Animated.spring(scaleAnim, {
        toValue: 1.08,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleKeyDown = (e) => {
    if (!isTV) return; // Pas de gestion de clavier sur mobile
    
    if (e.nativeEvent.key === 'Enter' || e.nativeEvent.key === 'OK' || e.nativeEvent.keyCode === 23) {
      if (onPress) {
        onPress();
      }
    }
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#00FE66'],
  });

  const borderWidth = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const shadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.9],
  });

  const shadowRadius = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const elevation = elevationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  // Sur mobile, utiliser un simple TouchableOpacity/Pressable sans animations TV
  if (!isTV) {
    return (
      <Pressable
        onPress={onPress}
        style={style}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  // Sur TV, utiliser le composant complet avec animations de focus
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          borderColor,
          borderWidth,
          shadowColor: '#00FE66',
          shadowOpacity,
          shadowRadius,
          shadowOffset: { width: 0, height: 6 },
          elevation,
        },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        nextFocusUp={nextFocusUp}
        nextFocusDown={nextFocusDown}
        nextFocusLeft={nextFocusLeft}
        nextFocusRight={nextFocusRight}
        hasTVPreferredFocus={hasTVPreferredFocus}
        isTVSelectable={isTVSelectable !== false}
        style={styles.pressable}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

TVFocusable.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  focusedStyle: PropTypes.object,
  nextFocusUp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nextFocusDown: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nextFocusLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nextFocusRight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  hasTVPreferredFocus: PropTypes.bool,
  isTVSelectable: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 8,
  },
  pressable: {
    flex: 1,
  },
});

export default TVFocusable;
