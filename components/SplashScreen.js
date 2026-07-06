import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Image } from 'react-native';
import PropTypes from 'prop-types';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    // Timer pour finir le splash (10 secondes)
    const timer = setTimeout(() => {
      onFinish();
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Image 
        source={require('../../assets/splash.png')} 
        style={styles.splashImage}
        resizeMode="cover"
      />
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
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;
