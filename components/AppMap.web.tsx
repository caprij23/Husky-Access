import React, { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface AppMapRef {
  animateToRegion: (region: unknown, duration?: number) => void;
}

interface Props {
  initialRegion?: unknown;
  originCoordinate?: { latitude: number; longitude: number };
  markerCoordinate?: { latitude: number; longitude: number };
  markerTitle?: string;
  routeCoords?: { latitude: number; longitude: number }[];
  onUserLocation?: (coords: { latitude: number; longitude: number }) => void;
  showAccessibleRoutes?: boolean;
  isNavigating?: boolean;
  satellite?: boolean;
}

const AppMap = forwardRef<AppMapRef, Props>((_props, ref) => {
  useImperativeHandle(ref, () => ({ animateToRegion: () => {} }));
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map view (mobile only)</Text>
    </View>
  );
});

export default AppMap;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#d4c9a8',
    justifyContent: 'center', alignItems: 'center',
  },
  text: { color: '#666', fontSize: 14 },
});
