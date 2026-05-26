import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppMap, { AppMapRef } from '../components/AppMap';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const UW_REGION = {
  latitude: 47.6553,
  longitude: -122.3060,
  latitudeDelta: 0.014,
  longitudeDelta: 0.014,
};

type Building = { latitude: number; longitude: number; name: string };

const BUILDINGS: Record<string, Building> = {
  'kane':           { latitude: 47.65677180390987,  longitude: -122.30913957352482, name: 'Kane Hall' },
  'kane hall':      { latitude: 47.65677180390987,  longitude: -122.30913957352482, name: 'Kane Hall' },
  'odegaard':       { latitude: 47.65664678424963,  longitude: -122.31034214529939, name: 'Odegaard Library' },
  'odegaard library': { latitude: 47.65664678424963, longitude: -122.31034214529939, name: 'Odegaard Library' },
  'mary gates':     { latitude: 47.65325,           longitude: -122.30797,          name: 'Mary Gates Hall' },
  'mary gates hall':{ latitude: 47.65325,           longitude: -122.30797,          name: 'Mary Gates Hall' },
  'suzzallo':       { latitude: 47.656085819766396, longitude: -122.30841394468871, name: 'Suzzallo Library' },
  'suzallo':        { latitude: 47.656085819766396, longitude: -122.30841394468871, name: 'Suzzallo Library' },
  'suzzallo library': { latitude: 47.656085819766396, longitude: -122.30841394468871, name: 'Suzzallo Library' },
  'hub':            { latitude: 47.655504900140095, longitude: -122.30504158701689, name: 'HUB' },
  'husky union':    { latitude: 47.655504900140095, longitude: -122.30504158701689, name: 'HUB' },
  'pop health':     { latitude: 47.654906524384614, longitude: -122.31186353490023, name: 'Pop Health' },
  'hans rosling':   { latitude: 47.654906524384614, longitude: -122.31186353490023, name: 'Pop Health' },
  'population health': { latitude: 47.654906524384614, longitude: -122.31186353490023, name: 'Pop Health' },
};

// Deduplicated list for autocomplete display
const BUILDING_LIST = [
  { key: 'kane',        display: 'Kane Hall' },
  { key: 'odegaard',    display: 'Odegaard Library' },
  { key: 'mary gates',  display: 'Mary Gates Hall' },
  { key: 'suzzallo',    display: 'Suzzallo Library' },
  { key: 'hub',         display: 'HUB' },
  { key: 'pop health',  display: 'Pop Health' },
];

function getSuggestions(text: string) {
  const q = text.toLowerCase().trim();
  if (q.length < 1) return [];
  return BUILDING_LIST.filter(
    b => b.display.toLowerCase().includes(q) || b.key.includes(q)
  ).slice(0, 4);
}

const FREQUENT = [
  { id: 'kane',       label: 'Kane',       bg: '#4A0072' },
  { id: 'odegaard',   label: 'Odegaard',   bg: '#C2185B' },
  { id: 'mary-gates', label: 'Mary Gates', bg: '#E65100' },
  { id: 'suzzallo',   label: 'Suzzallo',   bg: '#6A1B9A' },
  { id: 'hub',        label: 'HUB',        bg: '#4527A0' },
  { id: 'pop-health', label: 'Pop Health', bg: '#00695C' },
];

const BOTTOM_NAV_H  = 60;
const SHEET_HEIGHT  = SCREEN_HEIGHT * 0.73;
const COLLAPSED_VIS = 128;
const MID_VIS       = SCREEN_HEIGHT * 0.50;

const T_COLLAPSED = SHEET_HEIGHT - COLLAPSED_VIS;
const T_MID       = SHEET_HEIGHT - MID_VIS;
const T_EXPANDED  = 0;
const SNAPS = [T_COLLAPSED, T_MID, T_EXPANDED];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<AppMapRef>(null);

  const [toText,       setToText]       = useState('');
  const [fromText,     setFromText]     = useState('');
  const [destination,  setDestination]  = useState<Building | null>(null);
  const [origin,       setOrigin]       = useState<Building | null>(null);
  const [showFrom,     setShowFrom]     = useState(false);
  const [toSuggestions,   setToSugg]   = useState<typeof BUILDING_LIST>([]);
  const [fromSuggestions, setFromSugg] = useState<typeof BUILDING_LIST>([]);
  const [routeCoords,  setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [snapIdx,      setSnapIdx]     = useState(0);

  const userGPS = useRef<{ latitude: number; longitude: number } | null>(null);

  // ── sheet pan ──────────────────────────────────────────────────────────
  const translateY = useRef(new Animated.Value(T_COLLAPSED)).current;
  const curY       = useRef(T_COLLAPSED);
  const snapIdxRef = useRef(0);

  useEffect(() => {
    const id = translateY.addListener(({ value }) => { curY.current = value; });
    return () => translateY.removeListener(id);
  }, [translateY]);

  const snapTo = useCallback((idx: number) => {
    const target = SNAPS[idx];
    Animated.spring(translateY, {
      toValue: target, damping: 22, stiffness: 200, useNativeDriver: true,
    }).start(() => { curY.current = target; });
    snapIdxRef.current = idx;
    setSnapIdx(idx);
  }, [translateY]);

  const snapToRef = useRef(snapTo);
  useEffect(() => { snapToRef.current = snapTo; }, [snapTo]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 3,
      onPanResponderGrant: () => {
        translateY.stopAnimation();
        curY.current = (translateY as any)._value ?? T_COLLAPSED;
      },
      onPanResponderMove: (_, { dy }) => {
        translateY.setValue(Math.max(T_EXPANDED, Math.min(T_COLLAPSED, curY.current + dy)));
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        const pos = Math.max(T_EXPANDED, Math.min(T_COLLAPSED, curY.current + dy));
        let nearest = 0, minDist = Math.abs(pos - SNAPS[0]);
        for (let i = 1; i < SNAPS.length; i++) {
          const d = Math.abs(pos - SNAPS[i]);
          if (d < minDist) { minDist = d; nearest = i; }
        }
        if (vy < -0.5 && nearest < SNAPS.length - 1) nearest++;
        if (vy > 0.5  && nearest > 0)                nearest--;
        snapToRef.current(nearest);
      },
    })
  ).current;

  // ── destination input ──────────────────────────────────────────────────
  const handleToChange = (text: string) => {
    setToText(text);
    setToSugg(getSuggestions(text));
    if (!text.trim()) { setDestination(null); setRouteCoords([]); }
  };

  const selectToSuggestion = useCallback((item: typeof BUILDING_LIST[0]) => {
    const found = BUILDINGS[item.key];
    if (!found) return;
    setToText(found.name);
    setDestination(found);
    setToSugg([]);
    setRouteCoords([]);
    mapRef.current?.animateToRegion(
      { latitude: found.latitude, longitude: found.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 },
      800
    );
    snapTo(0);
  }, [snapTo]);

  const doSearch = useCallback(() => {
    const found = BUILDINGS[toText.toLowerCase().trim()];
    if (!found) return;
    setDestination(found);
    setToSugg([]);
    setRouteCoords([]);
    mapRef.current?.animateToRegion(
      { latitude: found.latitude, longitude: found.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 },
      800
    );
    snapTo(0);
  }, [toText, snapTo]);

  // ── from input ─────────────────────────────────────────────────────────
  const handleFromChange = (text: string) => {
    setFromText(text);
    setFromSugg(getSuggestions(text));
    if (!text.trim()) setOrigin(null);
  };

  const selectFromSuggestion = useCallback((item: typeof BUILDING_LIST[0]) => {
    const found = BUILDINGS[item.key];
    if (!found) return;
    setFromText(found.name);
    setOrigin(found);
    setFromSugg([]);
  }, []);

  // ── route fetch (OSRM foot/walking) ────────────────────────────────────
  const fetchRoute = useCallback(async () => {
    if (!destination) return;
    const start = origin ?? (userGPS.current ? { ...userGPS.current, name: 'My Location' } : null);
    if (!start) return;

    setLoadingRoute(true);
    try {
      const url =
        `https://router.project-osrm.org/route/v1/foot/` +
        `${start.longitude},${start.latitude};${destination.longitude},${destination.latitude}` +
        `?overview=full&geometries=geojson`;
      const res  = await fetch(url);
      const data = await res.json();

      if (data.routes?.[0]) {
        const coords: { latitude: number; longitude: number }[] =
          data.routes[0].geometry.coordinates.map(([lon, lat]: [number, number]) => ({
            latitude: lat, longitude: lon,
          }));
        setRouteCoords(coords);

        const lats = coords.map(c => c.latitude);
        const lons = coords.map(c => c.longitude);
        mapRef.current?.animateToRegion({
          latitude:      (Math.min(...lats) + Math.max(...lats)) / 2,
          longitude:     (Math.min(...lons) + Math.max(...lons)) / 2,
          latitudeDelta: (Math.max(...lats) - Math.min(...lats)) * 1.6 + 0.004,
          longitudeDelta:(Math.max(...lons) - Math.min(...lons)) * 1.6 + 0.004,
        }, 1000);
        snapTo(0);
      }
    } catch (e) {
      console.error('Route fetch failed:', e);
    } finally {
      setLoadingRoute(false);
    }
  }, [origin, destination, snapTo]);

  // ── directions button reveals from field ───────────────────────────────
  const handleDirectionsBtn = useCallback(() => {
    setShowFrom(true);
    snapTo(1);
  }, [snapTo]);

  // ── frequent destinations ──────────────────────────────────────────────
  const applyFrequent = useCallback((id: string) => {
    if (id === 'kane') { router.push('/kane'); return; }
    const key   = id.replace('-', ' ');
    const found = BUILDINGS[key];
    if (!found) return;
    setToText(found.name);
    setDestination(found);
    setShowFrom(false);
    setOrigin(null);
    setRouteCoords([]);
    mapRef.current?.animateToRegion(
      { latitude: found.latitude, longitude: found.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 },
      800
    );
    snapTo(0);
  }, [router, snapTo]);

  const canRoute = destination !== null && showFrom && (fromText.trim().length > 0 || userGPS.current !== null);
  const sheetBottom = BOTTOM_NAV_H + insets.bottom;

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <AppMap
        ref={mapRef}
        initialRegion={UW_REGION}
        originCoordinate={origin ?? undefined}
        markerCoordinate={destination ?? undefined}
        markerTitle={destination?.name}
        routeCoords={routeCoords}
        onUserLocation={coords => { userGPS.current = coords; }}
      />

      {/* Settings button */}
      <TouchableOpacity style={[styles.settingsBtn, { top: insets.top + 6 }]} onPress={() => router.push('/settings')}>
        <Ionicons name="settings-outline" size={22} color="#444" />
      </TouchableOpacity>

      {/* ── Bottom sheet ──────────────────────────────────────────────── */}
      <Animated.View style={[styles.sheet, { bottom: sheetBottom, transform: [{ translateY }] }]}>

        <View {...panResponder.panHandlers} style={styles.handleZone}>
          <View style={styles.handle} />
        </View>

        {/* From field (revealed after directions btn) */}
        {showFrom && (
          <View style={styles.fromSection}>
            <View style={styles.fromRow}>
              <View style={styles.dotOrigin} />
              <TextInput
                style={styles.routeInput}
                placeholder="Starting location"
                placeholderTextColor="#aaa"
                value={fromText}
                onChangeText={handleFromChange}
                returnKeyType="next"
                onFocus={() => snapTo(1)}
                autoFocus
              />
            </View>

            {/* From autocomplete */}
            {fromSuggestions.length > 0 && (
              <View style={styles.suggestionList}>
                {fromSuggestions.map(item => (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.suggestionItem}
                    onPress={() => selectFromSuggestion(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="location-outline" size={15} color="#9B59B6" />
                    <Text style={styles.suggestionText}>{item.display}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Go / Get Route button */}
            {canRoute && (
              <TouchableOpacity
                style={styles.goBtn}
                onPress={fetchRoute}
                activeOpacity={0.85}
                disabled={loadingRoute}
                accessibilityLabel="Get accessible route"
                accessibilityRole="button"
              >
                {loadingRoute
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Ionicons name="accessibility" size={20} color="#fff" />
                }
                <Text style={styles.goBtnText}>
                  {loadingRoute ? 'Finding route…' : 'Get Accessible Route'}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.fromDivider} />
          </View>
        )}

        {/* Destination search row */}
        <View style={styles.searchOuter}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Where are you going to?"
              placeholderTextColor="#999"
              value={toText}
              onChangeText={handleToChange}
              onSubmitEditing={doSearch}
              returnKeyType="search"
              onFocus={() => snapTo(1)}
            />
            <TouchableOpacity onPress={doSearch}>
              <Ionicons name="mic-outline" size={22} color="#999" />
            </TouchableOpacity>
          </View>

          {destination && !showFrom && (
            <TouchableOpacity style={styles.directionsBtn} onPress={handleDirectionsBtn}>
              <Ionicons name="navigate" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Destination autocomplete */}
        {toSuggestions.length > 0 && (
          <View style={[styles.suggestionList, { marginHorizontal: 16, marginTop: 2 }]}>
            {toSuggestions.map(item => (
              <TouchableOpacity
                key={item.key}
                style={styles.suggestionItem}
                onPress={() => selectToSuggestion(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="location-outline" size={15} color="#9B59B6" />
                <Text style={styles.suggestionText}>{item.display}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Mid: recent locations (hidden when suggestions showing) */}
        {snapIdx >= 1 && toSuggestions.length === 0 && fromSuggestions.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent locations</Text>
            {[
              { icon: 'home' as const,      label: 'Home' },
              { icon: 'briefcase' as const, label: 'Work' },
            ].map(({ icon, label }) => (
              <TouchableOpacity key={label} style={styles.locationRow} activeOpacity={0.7}>
                <View style={styles.locationIconWrap}>
                  <Ionicons name={icon} size={18} color="#4A90D9" />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>{label}</Text>
                  <Text style={styles.locationSub}>Set once and go</Text>
                </View>
                <Ionicons name="arrow-forward" size={18} color="#4A90D9" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Expanded: frequent destinations */}
        {snapIdx >= 2 && toSuggestions.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequent Destinations</Text>
            <View style={styles.chipGrid}>
              {FREQUENT.map(({ id, label, bg }) => (
                <TouchableOpacity
                  key={id}
                  style={[styles.chip, { backgroundColor: bg }]}
                  onPress={() => applyFrequent(id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.chipText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </Animated.View>

      {/* Bottom navigation */}
      <View style={[styles.bottomNav, { height: BOTTOM_NAV_H + insets.bottom, paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="home" size={24} color="#9B59B6" />
          <Text style={[styles.navLabel, styles.navActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/reportscreen_1')}>
          <Ionicons name="warning-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/community')}>
          <Ionicons name="mail-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/profile_page')}>
          <Ionicons name="person-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  settingsBtn: {
    position: 'absolute', right: 16,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 4 },
    }),
    zIndex: 10,
  },

  sheet: {
    position: 'absolute', left: 0, right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: -4 } },
      android: { elevation: 10 },
    }),
    zIndex: 5,
  },

  handleZone: { alignItems: 'center', paddingVertical: 12 },
  handle:     { width: 42, height: 4, borderRadius: 2, backgroundColor: '#DDD' },

  fromSection: { marginHorizontal: 16, marginBottom: 4 },
  fromRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F5F5', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 12, gap: 10,
  },
  dotOrigin: {
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 2.5, borderColor: '#1565C0', backgroundColor: '#fff',
  },
  routeInput:  { flex: 1, fontSize: 14, color: '#333', padding: 0 },
  fromDivider: { height: 6 },

  goBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 10, marginBottom: 2,
    backgroundColor: '#7209B7',
    borderRadius: 14, paddingVertical: 14,
    ...Platform.select({
      ios:     { shadowColor: '#7209B7', shadowOpacity: 0.45, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 5 },
    }),
  },
  goBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  searchOuter: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 4, gap: 8,
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25, paddingHorizontal: 14, paddingVertical: 11,
    gap: 8,
    borderBottomWidth: 1.5, borderBottomColor: '#333',
  },
  searchInput: { flex: 1, fontSize: 15, color: '#333', padding: 0 },

  directionsBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#9B59B6',
    justifyContent: 'center', alignItems: 'center',
    ...Platform.select({
      ios:     { shadowColor: '#9B59B6', shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 4 },
    }),
  },

  suggestionList: {
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: '#EBEBEB',
    overflow: 'hidden', marginBottom: 4,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 3 },
    }),
  },
  suggestionItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  suggestionText: { fontSize: 14, color: '#222' },

  section:      { paddingHorizontal: 16, paddingTop: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#222', marginBottom: 10 },

  locationRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F3F3', borderRadius: 14,
    padding: 12, marginBottom: 10, gap: 12,
  },
  locationIconWrap: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#E4F0FD', justifyContent: 'center', alignItems: 'center',
  },
  locationInfo:  { flex: 1 },
  locationLabel: { fontSize: 14, fontWeight: '600', color: '#222' },
  locationSub:   { fontSize: 12, color: '#4A90D9', marginTop: 2 },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip:     { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  chipText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee', zIndex: 20,
  },
  navItem:   { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  navLabel:  { fontSize: 11, color: '#888' },
  navActive: { color: '#9B59B6' },
});
