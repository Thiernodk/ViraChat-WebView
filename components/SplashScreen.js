import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text, Dimensions, Animated } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de pulsation continue
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Timer pour finir le splash (10 secondes)
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 10000);

    return () => {
      clearTimeout(timer);
      pulseAnimation.stop();
    };
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
          },
        ]}
      >
        {/* Icône TV animée */}
        <View style={styles.iconContainer}>
          <Icon name="tv" size={120} color="#00FE66" />
          <View style={styles.signalBars}>
            <View style={[styles.signalBar, styles.signalBar1]} />
            <View style={[styles.signalBar, styles.signalBar2]} />
            <View style={[styles.signalBar, styles.signalBar3]} />
            <View style={[styles.signalBar, styles.signalBar4]} />
          </View>
        </View>

        {/* Logo texte */}
        <Text style={styles.title}>Limon+ TV</Text>
        <Text style={styles.subtitle}>BOX</Text>
      </Animated.View>
    </View>
  );
};

SplashScreen.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  signalBars: {
    position: 'absolute',
    right: -10,
    top: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  signalBar: {
    width: 4,
    backgroundColor: '#00FE66',
    marginLeft: 2,
    borderRadius: 2,
  },
  signalBar1: {
    height: 8,
  },
  signalBar2: {
    height: 14,
  },
  signalBar3: {
    height: 20,
  },
  signalBar4: {
    height: 26,
  },
  title: {
    color: '#00FE66',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 254, 102, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 8,
    marginTop: -5,
    marginBottom: 40,
  },
});

export default SplashScreen;
