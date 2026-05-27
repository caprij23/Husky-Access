import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { WHEELCHAIR_ROUTES, LIMITED_MOBILITY_ROUTES } from '../constants/accessibleRoutes';

export interface AppMapRef {
  animateToRegion: (region: Region, duration?: number) => void;
}

interface Props {
  initialRegion: Region;
  originCoordinate?: { latitude: number; longitude: number };
  markerCoordinate?: { latitude: number; longitude: number };
  markerTitle?: string;
  routeCoords?: { latitude: number; longitude: number }[];
  onUserLocation?: (coords: { latitude: number; longitude: number }) => void;
  showAccessibleRoutes?: boolean;
  isNavigating?: boolean;
  satellite?: boolean;
}

const PIN = 34;
const PURPLE = '#7209B7';
const BLUE   = '#1565C0';

function Pin({ color }: { color: string }) {
  const hole = PIN * 0.37;
  const tw   = PIN * 0.28;
  const th   = PIN * 0.42;
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{
        width: PIN, height: PIN, borderRadius: PIN / 2,
        backgroundColor: color, justifyContent: 'center', alignItems: 'center',
      }}>
        <View style={{ width: hole, height: hole, borderRadius: hole / 2, backgroundColor: '#fff' }} />
      </View>
      <View style={{
        width: 0, height: 0,
        borderLeftWidth: tw, borderRightWidth: tw, borderTopWidth: th,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderTopColor: color, marginTop: -3,
      }} />
    </View>
  );
}

const AppMap = forwardRef<AppMapRef, Props>(
  ({ initialRegion, originCoordinate, markerCoordinate, markerTitle, routeCoords, onUserLocation, showAccessibleRoutes, isNavigating, satellite }, ref) => {
    const mapRef = useRef<MapView>(null);

    useImperativeHandle(ref, () => ({
      animateToRegion: (region, duration = 800) =>
        mapRef.current?.animateToRegion(region, duration),
    }));

    return (
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        mapType={satellite ? 'hybrid' : 'standard'}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        onUserLocationChange={e => {
          const coord = e.nativeEvent.coordinate;
          if (coord) onUserLocation?.({ latitude: coord.latitude, longitude: coord.longitude });
        }}
      >
        {showAccessibleRoutes && LIMITED_MOBILITY_ROUTES.map(route => (
          <Polyline
            key={`lm-${route.id}`}
            coordinates={route.coords}
            strokeColor="#F39C12"
            strokeWidth={3}
            lineJoin="round"
            lineCap="round"
          />
        ))}
        {showAccessibleRoutes && WHEELCHAIR_ROUTES.map(route => (
          <Polyline
            key={`wc-${route.id}`}
            coordinates={route.coords}
            strokeColor="#1565C0"
            strokeWidth={3}
            lineJoin="round"
            lineCap="round"
          />
        ))}
        {routeCoords && routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={PURPLE}
            strokeWidth={5}
            lineJoin="round"
            lineCap="round"
            lineDashPattern={isNavigating ? [8, 10] : undefined}
          />
        )}
        {originCoordinate && (
          <Marker coordinate={originCoordinate} title="Start" tracksViewChanges={false}>
            <Pin color={BLUE} />
          </Marker>
        )}
        {markerCoordinate && (
          <Marker coordinate={markerCoordinate} title={markerTitle} tracksViewChanges={false}>
            <Pin color={PURPLE} />
          </Marker>
        )}
      </MapView>
    );
  }
);

export default AppMap;
