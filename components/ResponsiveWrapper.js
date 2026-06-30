import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');

const ResponsiveWrapper = ({ children }) => {
  // Interface identique sur TV et mobile/tablette - pas de scaling
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

ResponsiveWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ResponsiveWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    backgroundColor: '#000',
  },
});
