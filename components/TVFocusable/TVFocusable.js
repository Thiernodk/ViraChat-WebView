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

  const handleFocus = () => {
    if (!isTV) return; // Pas d'animation de focus sur mobile
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = () => {
    if (!isTV) return; // Pas d'animation de focus sur mobile
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressIn = () => {
    if (isTV) {
      // Animation de press sur TV
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    // Sur mobile, comportement tactile par défaut de Pressable
  };

  const handlePressOut = () => {
    if (isTV) {
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
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
    outputRange: ['transparent', '#00ff00'],
  });

  const shadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  const shadowRadius = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
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
          shadowColor: '#00ff00',
          shadowOpacity,
          shadowRadius,
          shadowOffset: { width: 0, height: 5 },
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
