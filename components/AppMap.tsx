// TypeScript resolution stub — Metro uses AppMap.native.tsx / AppMap.web.tsx at runtime.
import React, { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';

export interface AppMapRef {
  animateToRegion: (
    region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number },
    duration?: number
  ) => void;
}

interface Props {
  initialRegion: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
  originCoordinate?: { latitude: number; longitude: number };
  markerCoordinate?: { latitude: number; longitude: number };
  markerTitle?: string;
  routeCoords?: { latitude: number; longitude: number }[];
  onUserLocation?: (coords: { latitude: number; longitude: number }) => void;
  showAccessibleRoutes?: boolean;
}

const AppMap = forwardRef<AppMapRef, Props>((_props, ref) => {
  useImperativeHandle(ref, () => ({ animateToRegion: () => {} }));
  return <View style={StyleSheet.absoluteFillObject} />;
});

export default AppMap;
