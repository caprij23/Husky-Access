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
import { useUser } from '../context/UserContext';
import {
  NavBanner,
  NavStep,
  findClosestPointIndex,
  formatDistance,
  generateSteps,
  getNavBanner,
  haversine,
  sumRemainingDistance,
} from '../utils/navigation';

const C3D_KEY    = '0001085cc708b9cef47080f064612ca5';
const C3D_MAP_ID = '2099';

async function fetchCampusRoute(
  fromLat: number, fromLng: number,
  toLat: number,   toLng: number,
  ada: boolean,
): Promise<{ latitude: number; longitude: number }[] | null> {
  const url =
    `https://api.concept3d.com/wayfinding/v2?map=${C3D_MAP_ID}` +
    `&stamp=${Date.now()}&fromLevel=0&toLevel=0&currentLevel=0` +
    `&fromLat=${fromLat}&fromLng=${fromLng}` +
    `&toLat=${toLat}&toLng=${toLng}` +
    (ada ? '&ada' : '') +
    `&key=${C3D_KEY}`;
  const res  = await fetch(url);
  const data = await res.json();
  if (data.status !== 'ok' || !data.routes?.[0]?.fullPath?.length) return null;
  return (data.routes[0].fullPath as [number, number][]).map(
    ([lng, lat]) => ({ latitude: lat, longitude: lng })
  );
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const UW_REGION = {
  latitude: 47.6553,
  longitude: -122.3060,
  latitudeDelta: 0.014,
  longitudeDelta: 0.014,
};

type Building = { latitude: number; longitude: number; name: string };

const BUILDINGS: Record<string, Building> = {
  // ── A ─────────────────────────────────────────────────────────────────
  'allen library':          { latitude: 47.655354, longitude: -122.306946, name: 'Allen Library' },
  'anderson hall':          { latitude: 47.651752, longitude: -122.307587, name: 'Anderson Hall' },
  'architecture hall':      { latitude: 47.654591, longitude: -122.310860, name: 'Architecture Hall' },
  // ── B ─────────────────────────────────────────────────────────────────
  'bagley hall':            { latitude: 47.653427, longitude: -122.308876, name: 'Bagley Hall' },
  'bagley':                 { latitude: 47.653427, longitude: -122.308876, name: 'Bagley Hall' },
  'benson hall':            { latitude: 47.653038, longitude: -122.309578, name: 'Benson Hall' },
  'benson':                 { latitude: 47.653038, longitude: -122.309578, name: 'Benson Hall' },
  'bill gates center':      { latitude: 47.652897, longitude: -122.304482, name: 'Bill & Melinda Gates Center' },
  'gates center':           { latitude: 47.652897, longitude: -122.304482, name: 'Bill & Melinda Gates Center' },
  'cse2':                   { latitude: 47.652897, longitude: -122.304482, name: 'Bill & Melinda Gates Center' },
  'bloedel hall':           { latitude: 47.651276, longitude: -122.307655, name: 'Bloedel Hall' },
  'bloedel':                { latitude: 47.651276, longitude: -122.307655, name: 'Bloedel Hall' },
  'burke museum':           { latitude: 47.660423, longitude: -122.311531, name: 'Burke Museum' },
  // ── C ─────────────────────────────────────────────────────────────────
  'chemistry building':     { latitude: 47.652897, longitude: -122.308403, name: 'Chemistry Building' },
  'chemistry':              { latitude: 47.652897, longitude: -122.308403, name: 'Chemistry Building' },
  'communications building':{ latitude: 47.656963, longitude: -122.305428, name: 'Communications Building' },
  'communications':         { latitude: 47.656963, longitude: -122.305428, name: 'Communications Building' },
  'condon hall':            { latitude: 47.656582, longitude: -122.316170, name: 'Condon Hall' },
  // ── D ─────────────────────────────────────────────────────────────────
  'denny hall':             { latitude: 47.658382, longitude: -122.308853, name: 'Denny Hall' },
  'denny':                  { latitude: 47.658382, longitude: -122.308853, name: 'Denny Hall' },
  // ── E ─────────────────────────────────────────────────────────────────
  'ece building':           { latitude: 47.653561, longitude: -122.306305, name: 'ECE Building' },
  'electrical engineering': { latitude: 47.653561, longitude: -122.306305, name: 'ECE Building' },
  'ece':                    { latitude: 47.653561, longitude: -122.306305, name: 'ECE Building' },
  // ── F ─────────────────────────────────────────────────────────────────
  'fluke hall':             { latitude: 47.655842, longitude: -122.303268, name: 'Fluke Hall' },
  'foege hall':             { latitude: 47.652267, longitude: -122.312988, name: 'Foege Hall' },
  'bioengineering':         { latitude: 47.652267, longitude: -122.312988, name: 'Foege Hall' },
  'genome sciences':        { latitude: 47.652267, longitude: -122.312988, name: 'Foege Hall' },
  'foster school':          { latitude: 47.659138, longitude: -122.308571, name: 'Foster School of Business' },
  'paccar hall':            { latitude: 47.659138, longitude: -122.308571, name: 'Foster School of Business' },
  'paccar':                 { latitude: 47.659138, longitude: -122.308571, name: 'Foster School of Business' },
  'foster':                 { latitude: 47.659138, longitude: -122.308571, name: 'Foster School of Business' },
  // ── G ─────────────────────────────────────────────────────────────────
  'gerberding hall':        { latitude: 47.655472, longitude: -122.309372, name: 'Gerberding Hall' },
  'gerberding':             { latitude: 47.655472, longitude: -122.309372, name: 'Gerberding Hall' },
  'gould hall':             { latitude: 47.654964, longitude: -122.312759, name: 'Gould Hall' },
  'gowen hall':             { latitude: 47.656334, longitude: -122.307770, name: 'Gowen Hall' },
  'guggenheim hall':        { latitude: 47.654251, longitude: -122.306381, name: 'Guggenheim Hall' },
  'guggenheim':             { latitude: 47.654251, longitude: -122.306381, name: 'Guggenheim Hall' },
  'guthrie hall':           { latitude: 47.653965, longitude: -122.310928, name: 'Guthrie Hall' },
  // ── H ─────────────────────────────────────────────────────────────────
  'haggett hall':           { latitude: 47.659260, longitude: -122.303680, name: 'Haggett Hall' },
  'hall health':            { latitude: 47.656170, longitude: -122.304131, name: 'Hall Health Center' },
  'hall health center':     { latitude: 47.656170, longitude: -122.304131, name: 'Hall Health Center' },
  'health sciences':        { latitude: 47.650707, longitude: -122.308380, name: 'Health Sciences Library' },
  'health sciences library':{ latitude: 47.650707, longitude: -122.308380, name: 'Health Sciences Library' },
  'henry art gallery':      { latitude: 47.656525, longitude: -122.311600, name: 'Henry Art Gallery' },
  'henry':                  { latitude: 47.656525, longitude: -122.311600, name: 'Henry Art Gallery' },
  'hitchcock hall':         { latitude: 47.651894, longitude: -122.311531, name: 'Hitchcock Hall' },
  'hub':                    { latitude: 47.655373, longitude: -122.305183, name: 'HUB' },
  'husky union':            { latitude: 47.655373, longitude: -122.305183, name: 'HUB' },
  'husky union building':   { latitude: 47.655373, longitude: -122.305183, name: 'HUB' },
  'husky stadium':          { latitude: 47.650291, longitude: -122.301636, name: 'Husky Stadium' },
  // ── I ─────────────────────────────────────────────────────────────────
  'ima':                    { latitude: 47.653271, longitude: -122.301926, name: 'IMA' },
  'intramural activities':  { latitude: 47.653271, longitude: -122.301926, name: 'IMA' },
  // ── J–K ───────────────────────────────────────────────────────────────
  'johnson hall':           { latitude: 47.654568, longitude: -122.308868, name: 'Johnson Hall' },
  'kane':                   { latitude: 47.656601, longitude: -122.309212, name: 'Kane Hall' },
  'kane hall':              { latitude: 47.656601, longitude: -122.309212, name: 'Kane Hall' },
  'kincaid hall':           { latitude: 47.652637, longitude: -122.310646, name: 'Kincaid Hall' },
  // ── L ─────────────────────────────────────────────────────────────────
  'lander hall':            { latitude: 47.655678, longitude: -122.315018, name: 'Lander Hall' },
  'lewis hall':             { latitude: 47.658848, longitude: -122.305367, name: 'Lewis Hall' },
  'life sciences':          { latitude: 47.652252, longitude: -122.309883, name: 'Life Sciences Building' },
  'life sciences building': { latitude: 47.652252, longitude: -122.309883, name: 'Life Sciences Building' },
  'loew hall':              { latitude: 47.654266, longitude: -122.304512, name: 'Loew Hall' },
  // ── M ─────────────────────────────────────────────────────────────────
  'mary gates':             { latitude: 47.65513781785859, longitude: -122.3079826865079, name: 'Mary Gates Hall' },
  'mary gates hall':        { latitude: 47.65513781785859, longitude: -122.3079826865079, name: 'Mary Gates Hall' },
  'mcmahon hall':           { latitude: 47.658184, longitude: -122.303795, name: 'McMahon Hall' },
  'meany hall':             { latitude: 47.655571, longitude: -122.310661, name: 'Meany Hall' },
  'miller hall':            { latitude: 47.657200, longitude: -122.306335, name: 'Miller Hall' },
  'molecular engineering':  { latitude: 47.654293, longitude: -122.309921, name: 'Molecular Engineering & Sciences' },
  'more hall':              { latitude: 47.652515, longitude: -122.304863, name: 'More Hall' },
  'music building':         { latitude: 47.657745, longitude: -122.305954, name: 'Music Building' },
  // ── O ─────────────────────────────────────────────────────────────────
  'odegaard':               { latitude: 47.656445, longitude: -122.310440, name: 'Odegaard Library' },
  'odegaard library':       { latitude: 47.656445, longitude: -122.310440, name: 'Odegaard Library' },
  'ougl':                   { latitude: 47.656445, longitude: -122.310440, name: 'Odegaard Library' },
  // ── P ─────────────────────────────────────────────────────────────────
  'padelford hall':         { latitude: 47.656940, longitude: -122.304268, name: 'Padelford Hall' },
  'padelford':              { latitude: 47.656940, longitude: -122.304268, name: 'Padelford Hall' },
  'parrington hall':        { latitude: 47.657394, longitude: -122.310287, name: 'Parrington Hall' },
  'paul allen center':      { latitude: 47.653233, longitude: -122.305847, name: 'Paul G. Allen Center (CSE)' },
  'cse':                    { latitude: 47.653233, longitude: -122.305847, name: 'Paul G. Allen Center (CSE)' },
  'allen center':           { latitude: 47.653233, longitude: -122.305847, name: 'Paul G. Allen Center (CSE)' },
  'physics':                { latitude: 47.653446, longitude: -122.310822, name: 'Physics/Astronomy Building' },
  'physics astronomy':      { latitude: 47.653446, longitude: -122.310822, name: 'Physics/Astronomy Building' },
  'pop health':             { latitude: 47.654906524384614, longitude: -122.31186353490023, name: 'Pop Health' },
  'hans rosling':           { latitude: 47.654906524384614, longitude: -122.31186353490023, name: 'Pop Health' },
  'population health':      { latitude: 47.654906524384614, longitude: -122.31186353490023, name: 'Pop Health' },
  // ── R ─────────────────────────────────────────────────────────────────
  'raitt hall':             { latitude: 47.657883, longitude: -122.307274, name: 'Raitt Hall' },
  'roberts hall':           { latitude: 47.652046, longitude: -122.305077, name: 'Roberts Hall' },
  // ── S ─────────────────────────────────────────────────────────────────
  'savery hall':            { latitude: 47.657196, longitude: -122.308334, name: 'Savery Hall' },
  'schmitz hall':           { latitude: 47.656555, longitude: -122.312752, name: 'Schmitz Hall' },
  'smith hall':             { latitude: 47.656612, longitude: -122.307220, name: 'Smith Hall' },
  'suzzallo':               { latitude: 47.655785, longitude: -122.308189, name: 'Suzzallo Library' },
  'suzallo':                { latitude: 47.655785, longitude: -122.308189, name: 'Suzzallo Library' },
  'suzzallo library':       { latitude: 47.655785, longitude: -122.308189, name: 'Suzzallo Library' },
  // ── T ─────────────────────────────────────────────────────────────────
  'thomson hall':           { latitude: 47.656532, longitude: -122.305809, name: 'Thomson Hall' },
  // ── U ─────────────────────────────────────────────────────────────────
  'uw medical center':      { latitude: 47.649403, longitude: -122.306999, name: 'UW Medical Center' },
  'uwmc':                   { latitude: 47.649403, longitude: -122.306999, name: 'UW Medical Center' },
  // ── W ─────────────────────────────────────────────────────────────────
  'gates hall':             { latitude: 47.659267, longitude: -122.311386, name: 'William H. Gates Hall' },
  'law school':             { latitude: 47.659267, longitude: -122.311386, name: 'William H. Gates Hall' },
  'william h gates hall':   { latitude: 47.659267, longitude: -122.311386, name: 'William H. Gates Hall' },
};

const BUILDING_LIST = [
  { key: 'allen library',           display: 'Allen Library' },
  { key: 'anderson hall',           display: 'Anderson Hall' },
  { key: 'architecture hall',       display: 'Architecture Hall' },
  { key: 'bagley hall',             display: 'Bagley Hall' },
  { key: 'benson hall',             display: 'Benson Hall' },
  { key: 'bill gates center',       display: 'Bill & Melinda Gates Center' },
  { key: 'bloedel hall',            display: 'Bloedel Hall' },
  { key: 'burke museum',            display: 'Burke Museum' },
  { key: 'chemistry building',      display: 'Chemistry Building' },
  { key: 'communications building', display: 'Communications Building' },
  { key: 'condon hall',             display: 'Condon Hall' },
  { key: 'denny hall',              display: 'Denny Hall' },
  { key: 'ece building',            display: 'ECE Building' },
  { key: 'fluke hall',              display: 'Fluke Hall' },
  { key: 'foege hall',              display: 'Foege Hall' },
  { key: 'foster school',           display: 'Foster School of Business' },
  { key: 'gerberding hall',         display: 'Gerberding Hall' },
  { key: 'gould hall',              display: 'Gould Hall' },
  { key: 'gowen hall',              display: 'Gowen Hall' },
  { key: 'guggenheim hall',         display: 'Guggenheim Hall' },
  { key: 'guthrie hall',            display: 'Guthrie Hall' },
  { key: 'haggett hall',            display: 'Haggett Hall' },
  { key: 'hall health',             display: 'Hall Health Center' },
  { key: 'health sciences',         display: 'Health Sciences Library' },
  { key: 'henry art gallery',       display: 'Henry Art Gallery' },
  { key: 'hitchcock hall',          display: 'Hitchcock Hall' },
  { key: 'hub',                     display: 'HUB' },
  { key: 'husky stadium',           display: 'Husky Stadium' },
  { key: 'ima',                     display: 'IMA' },
  { key: 'johnson hall',            display: 'Johnson Hall' },
  { key: 'kane',                    display: 'Kane Hall' },
  { key: 'kincaid hall',            display: 'Kincaid Hall' },
  { key: 'lander hall',             display: 'Lander Hall' },
  { key: 'lewis hall',              display: 'Lewis Hall' },
  { key: 'life sciences',           display: 'Life Sciences Building' },
  { key: 'loew hall',               display: 'Loew Hall' },
  { key: 'mary gates',              display: 'Mary Gates Hall' },
  { key: 'mcmahon hall',            display: 'McMahon Hall' },
  { key: 'meany hall',              display: 'Meany Hall' },
  { key: 'miller hall',             display: 'Miller Hall' },
  { key: 'molecular engineering',   display: 'Molecular Engineering & Sciences' },
  { key: 'more hall',               display: 'More Hall' },
  { key: 'music building',          display: 'Music Building' },
  { key: 'odegaard',                display: 'Odegaard Library' },
  { key: 'padelford hall',          display: 'Padelford Hall' },
  { key: 'parrington hall',         display: 'Parrington Hall' },
  { key: 'paul allen center',       display: 'Paul G. Allen Center (CSE)' },
  { key: 'physics',                 display: 'Physics/Astronomy Building' },
  { key: 'pop health',              display: 'Pop Health' },
  { key: 'raitt hall',              display: 'Raitt Hall' },
  { key: 'roberts hall',            display: 'Roberts Hall' },
  { key: 'savery hall',             display: 'Savery Hall' },
  { key: 'schmitz hall',            display: 'Schmitz Hall' },
  { key: 'smith hall',              display: 'Smith Hall' },
  { key: 'suzzallo',                display: 'Suzzallo Library' },
  { key: 'thomson hall',            display: 'Thomson Hall' },
  { key: 'uw medical center',       display: 'UW Medical Center' },
  { key: 'gates hall',              display: 'William H. Gates Hall' },
];

function getSuggestions(text: string) {
  const q = text.toLowerCase().trim();
  if (q.length < 1) return [];
  return BUILDING_LIST.filter(
    b => b.display.toLowerCase().includes(q) || b.key.includes(q)
  ).slice(0, 5);
}

const FREQUENT = [
  { id: 'kane',          label: 'Kane',       bg: '#4A0072' },
  { id: 'odegaard',      label: 'Odegaard',   bg: '#C2185B' },
  { id: 'suzzallo',      label: 'Suzzallo',   bg: '#6A1B9A' },
  { id: 'hub',           label: 'HUB',        bg: '#4527A0' },
  { id: 'foster school', label: 'Foster',     bg: '#1565C0' },
  { id: 'paul allen center', label: 'CSE',    bg: '#00695C' },
  { id: 'ima',           label: 'IMA',        bg: '#E65100' },
  { id: 'pop health',    label: 'Pop Health', bg: '#2E7D32' },
];

// Accessibility needs that trigger the UW accessible route graph
const MOBILITY_NEEDS = ['Wheelchair access', 'Elevator required'];

const BOTTOM_NAV_H  = 60;
const SHEET_HEIGHT  = SCREEN_HEIGHT * 0.73;
const COLLAPSED_VIS = 128;
const MID_VIS       = SCREEN_HEIGHT * 0.50;
const T_COLLAPSED = SHEET_HEIGHT - COLLAPSED_VIS;
const T_MID       = SHEET_HEIGHT - MID_VIS;
const T_EXPANDED  = 0;
const SNAPS = [T_COLLAPSED, T_MID, T_EXPANDED];

export default function HomeScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const mapRef  = useRef<AppMapRef>(null);
  const { profile } = useUser();

  // ── search / routing state ─────────────────────────────────────────────
  const [toText,       setToText]       = useState('');
  const [fromText,     setFromText]     = useState('');
  const [destination,  setDestination]  = useState<Building | null>(null);
  const [origin,       setOrigin]       = useState<Building | null>(null);
  const [showFrom,     setShowFrom]     = useState(false);
  const [toSuggestions,   setToSugg]   = useState<typeof BUILDING_LIST>([]);
  const [fromSuggestions, setFromSugg] = useState<typeof BUILDING_LIST>([]);
  const [routeCoords,  setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [showAccessibleRoutes, setShowAccessibleRoutes] = useState(false);
  const [satellite,            setSatellite]            = useState(false);
  const [routeType,    setRouteType]   = useState<'accessible' | 'general' | null>(null);
  const [routeReady,   setRouteReady]  = useState(false);
  const [routeSummary, setRouteSummary] = useState('');
  const [snapIdx,      setSnapIdx]     = useState(0);

  // ── GPS ───────────────────────────────────────────────────────────────
  const userGPS = useRef<{ latitude: number; longitude: number } | null>(null);

  // ── navigation state ──────────────────────────────────────────────────
  const [isNavigating, setIsNavigating] = useState(false);
  const [navBanner,    setNavBanner]    = useState<NavBanner | null>(null);

  // Refs used inside GPS callbacks to avoid stale closures
  const isNavigatingRef  = useRef(false);
  const routeCoordsRef   = useRef<{ latitude: number; longitude: number }[]>([]);
  const navStepsRef      = useRef<NavStep[]>([]);
  const closestIdxRef    = useRef(0);
  const lastAnimPosRef   = useRef<{ latitude: number; longitude: number } | null>(null);

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
      onMoveShouldSetPanResponder:  (_, g) => Math.abs(g.dy) > 3,
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
        if (vy >  0.5 && nearest > 0)                nearest--;
        snapToRef.current(nearest);
      },
    })
  ).current;

  // ── destination input ──────────────────────────────────────────────────
  const clearRoute = () => {
    setRouteCoords([]);
    setRouteType(null);
    setRouteReady(false);
    setRouteSummary('');
    routeCoordsRef.current = [];
  };

  const handleToChange = (text: string) => {
    setToText(text);
    setToSugg(getSuggestions(text));
    if (!text.trim()) { setDestination(null); clearRoute(); }
  };

  const selectToSuggestion = useCallback((item: typeof BUILDING_LIST[0]) => {
    const found = BUILDINGS[item.key];
    if (!found) return;
    setToText(found.name);
    setDestination(found);
    setToSugg([]);
    clearRoute();
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
    clearRoute();
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

  // ── Navigation helpers ─────────────────────────────────────────────────
  const beginNavigation = useCallback(() => {
    const coords = routeCoordsRef.current;
    if (!coords.length) return;

    // Zoom into the start point so the user can orient themselves
    const startPt = coords[0];
    mapRef.current?.animateToRegion({
      latitude:      startPt.latitude,
      longitude:     startPt.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    }, 800);

    const steps = generateSteps(coords);
    navStepsRef.current     = steps;
    closestIdxRef.current   = 0;
    lastAnimPosRef.current  = null;
    isNavigatingRef.current = true;
    setIsNavigating(true);
    setRouteReady(false);
    setNavBanner(getNavBanner(steps, coords, 0));
  }, []);

  const endNavigation = useCallback(() => {
    isNavigatingRef.current = false;
    setIsNavigating(false);
    setNavBanner(null);
    setRouteReady(false);
    setRouteSummary('');
    closestIdxRef.current  = 0;
    lastAnimPosRef.current = null;
  }, []);

  // ── GPS location callback (called by AppMap on each location update) ───
  const handleUserLocation = useCallback((coords: { latitude: number; longitude: number }) => {
    userGPS.current = coords;

    if (!isNavigatingRef.current) return;
    const route = routeCoordsRef.current;
    const steps = navStepsRef.current;
    if (!route.length || !steps.length) return;

    // Advance along the route
    const newIdx = findClosestPointIndex(coords, route, closestIdxRef.current);
    closestIdxRef.current = newIdx;

    // Update the navigation banner
    const banner = getNavBanner(steps, route, newIdx);
    setNavBanner(banner);

    // If arrived, end navigation after a brief pause
    if (banner.arrived) {
      setTimeout(() => endNavigation(), 3000);
    }

    // Animate map to follow user (only if moved > 10 m since last animation)
    const last = lastAnimPosRef.current;
    if (!last || haversine(coords, last) > 10) {
      lastAnimPosRef.current = coords;
      mapRef.current?.animateToRegion({
        latitude:      coords.latitude,
        longitude:     coords.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      }, 600);
    }
  }, [endNavigation]);

  // ── Route fetch ────────────────────────────────────────────────────────
  const fetchRoute = useCallback(async () => {
    if (!destination) return;
    const start = origin ?? (userGPS.current ? { ...userGPS.current, name: 'My Location' } : null);
    if (!start) return;

    setLoadingRoute(true);
    try {
      // Wheelchair users get wheelchair-only paths; everyone else gets the full campus network
      const needsMobilityRoute = profile.accessibilityNeeds.some(n => MOBILITY_NEEDS.includes(n));

      let coords: { latitude: number; longitude: number }[] | null = null;
      let usedAccessible = needsMobilityRoute;

      // Use the Concept3D campus routing API — same engine as map.uw.edu
      coords = await fetchCampusRoute(
        start.latitude, start.longitude,
        destination.latitude, destination.longitude,
        needsMobilityRoute,
      );

      if (!coords) {
        // Fall back to OSRM pedestrian routing only if campus API fails
        const url =
          `https://router.project-osrm.org/route/v1/foot/` +
          `${start.longitude},${start.latitude};${destination.longitude},${destination.latitude}` +
          `?overview=full&geometries=geojson`;
        const res  = await fetch(url);
        const data = await res.json();
        if (data.routes?.[0]) {
          usedAccessible = false;
          coords = data.routes[0].geometry.coordinates.map(
            ([lon, lat]: [number, number]) => ({ latitude: lat, longitude: lon })
          );
        }
      }

      if (!coords || coords.length < 2) return;

      // Store coords in ref so beginNavigation can access them without stale closure
      routeCoordsRef.current = coords;
      setRouteCoords(coords);
      setRouteType(usedAccessible ? 'accessible' : 'general');
      setRouteSummary(formatDistance(sumRemainingDistance(coords, 0)));
      setRouteReady(true);

      // Zoom map out to show the complete route
      const lats = coords.map(c => c.latitude);
      const lons = coords.map(c => c.longitude);
      mapRef.current?.animateToRegion({
        latitude:      (Math.min(...lats) + Math.max(...lats)) / 2,
        longitude:     (Math.min(...lons) + Math.max(...lons)) / 2,
        latitudeDelta: (Math.max(...lats) - Math.min(...lats)) * 1.6 + 0.004,
        longitudeDelta:(Math.max(...lons) - Math.min(...lons)) * 1.6 + 0.004,
      }, 1000);

      snapTo(0); // collapse sheet to show the Start Navigation card
    } catch (e) {
      console.error('Route fetch failed:', e);
    } finally {
      setLoadingRoute(false);
    }
  }, [origin, destination, snapTo, profile.accessibilityNeeds]);

  const handleDirectionsBtn = useCallback(() => {
    setShowFrom(true);
    snapTo(1);
  }, [snapTo]);

  const applyFrequent = useCallback((id: string) => {
    if (id === 'kane') { router.push('/kane'); return; }
    const found = BUILDINGS[id];
    if (!found) return;
    setToText(found.name);
    setDestination(found);
    setShowFrom(false);
    setOrigin(null);
    clearRoute();
    mapRef.current?.animateToRegion(
      { latitude: found.latitude, longitude: found.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 },
      800
    );
    snapTo(0);
  }, [router, snapTo]);

  const canRoute = destination !== null && showFrom && (fromText.trim().length > 0 || userGPS.current !== null);
  const sheetBottom = BOTTOM_NAV_H + insets.bottom;

  // ── Route label ────────────────────────────────────────────────────────
  const routeLabel = routeType === 'accessible'
    ? '♿ Accessible route'
    : routeType === 'general'
    ? '🚶 General walking route'
    : null;

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
        onUserLocation={handleUserLocation}
        showAccessibleRoutes={showAccessibleRoutes}
        isNavigating={isNavigating}
        satellite={satellite}
      />

      {/* ── Navigation banner ─────────────────────────────────────────── */}
      {isNavigating && navBanner && (
        <View style={[styles.navBanner, { paddingTop: insets.top + 12 }]}>
          <View style={styles.navBannerInner}>
            <View style={styles.navBannerLeft}>
              <View style={[styles.navIconCircle, navBanner.arrived && styles.navIconCircleArrived]}>
                <Ionicons
                  name={navBanner.iconName as any}
                  size={28}
                  color="#fff"
                />
              </View>
              <View style={styles.navBannerText}>
                <Text style={styles.navInstruction} numberOfLines={1}>
                  {navBanner.instruction}
                </Text>
                {!navBanner.arrived && navBanner.distToNext !== 'arriving' && (
                  <Text style={styles.navDistToNext}>in {navBanner.distToNext}</Text>
                )}
              </View>
            </View>
            <View style={styles.navBannerRight}>
              {!navBanner.arrived && (
                <Text style={styles.navDistRemaining}>{navBanner.distRemaining}</Text>
              )}
              <TouchableOpacity style={styles.endNavBtn} onPress={endNavigation} activeOpacity={0.8}>
                <Ionicons name="close" size={16} color="#fff" />
                <Text style={styles.endNavBtnText}>End</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Settings and accessible route toggle (hidden during navigation) */}
      {!isNavigating && (
        <>
          <TouchableOpacity
            style={[styles.settingsBtn, { top: insets.top + 6 }]}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={22} color="#444" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.accessibleBtn, { top: insets.top + 6 }, showAccessibleRoutes && styles.accessibleBtnActive]}
            onPress={() => setShowAccessibleRoutes(v => !v)}
            activeOpacity={0.8}
          >
            <Ionicons name="accessibility-outline" size={20} color={showAccessibleRoutes ? '#fff' : '#444'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.satelliteBtn, { top: insets.top + 6 }, satellite && styles.accessibleBtnActive]}
            onPress={() => setSatellite(v => !v)}
            activeOpacity={0.8}
          >
            <Ionicons name="globe-outline" size={20} color={satellite ? '#fff' : '#444'} />
          </TouchableOpacity>
        </>
      )}

      {/* ── Bottom sheet ──────────────────────────────────────────────── */}
      {!isNavigating && (
        <Animated.View style={[styles.sheet, { bottom: sheetBottom, transform: [{ translateY }] }]}>
          <View {...panResponder.panHandlers} style={styles.handleZone}>
            <View style={styles.handle} />
          </View>

          {/* ── Route-ready card: shown after route is calculated ───────── */}
          {routeReady && !isNavigating && (
            <View style={styles.routeReadyCard}>
              <TouchableOpacity style={styles.routeReadyClose} onPress={clearRoute} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={16} color="#888" />
              </TouchableOpacity>
              <View style={styles.routeReadyInfo}>
                <View style={styles.routeReadyBadge}>
                  <Ionicons
                    name={routeType === 'accessible' ? 'accessibility' : 'walk'}
                    size={14}
                    color="#fff"
                  />
                  <Text style={styles.routeReadyBadgeText}>
                    {routeType === 'accessible' ? 'Accessible route' : 'Walking route'}
                  </Text>
                </View>
                <Text style={styles.routeReadyDist}>{routeSummary}</Text>
              </View>
              <TouchableOpacity
                style={styles.startNavBtn}
                onPress={beginNavigation}
                activeOpacity={0.88}
              >
                <Ionicons name="navigate" size={18} color="#fff" />
                <Text style={styles.startNavBtnText}>Start Navigation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reportPathBtn}
                onPress={() => router.push('/reportscreen_1')}
                activeOpacity={0.7}
              >
                <Ionicons name="flag-outline" size={13} color="#8A6AAC" />
                <Text style={styles.reportPathBtnText}>Missing a path? Report it</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* From field */}
          {showFrom && !routeReady && (
            <View style={styles.fromSection}>
              <TouchableOpacity
                style={styles.routeReadyClose}
                onPress={() => { setShowFrom(false); setFromText(''); setOrigin(null); clearRoute(); }}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={16} color="#888" />
              </TouchableOpacity>
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

              {/* Route type badge */}
              {routeLabel && !loadingRoute && (
                <View style={styles.routeBadge}>
                  <Text style={styles.routeBadgeText}>{routeLabel}</Text>
                </View>
              )}

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

          {/* Destination search */}
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

          {/* Recent locations */}
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

          {/* Frequent destinations */}
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
      )}

      {/* ── Bottom navigation (hidden during active navigation) ────────── */}
      {!isNavigating && (
        <View style={[styles.bottomNav, { height: BOTTOM_NAV_H + insets.bottom, paddingBottom: insets.bottom }]}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Ionicons name="home" size={24} color="#9B59B6" />
            <Text style={[styles.navLabel, styles.navActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.replace('/reportscreen_1')}>
            <Ionicons name="warning-outline" size={24} color="#888" />
            <Text style={styles.navLabel}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.replace('/community')}>
            <Ionicons name="mail-outline" size={24} color="#888" />
            <Text style={styles.navLabel}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.replace('/profile_page')}>
            <Ionicons name="person-outline" size={24} color="#888" />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const SHADOW_CARD = Platform.select({
  ios:     { shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } } as any,
  android: { elevation: 4 },
}) ?? {};

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Navigation banner ────────────────────────────────────────────────
  navBanner: {
    position: 'absolute', top: 0, left: 0, right: 0,
    backgroundColor: '#1565C0',
    zIndex: 30,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.28, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 12 },
    }),
  },
  navBannerInner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 18, gap: 12,
  },
  navBannerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14 },
  navIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center', alignItems: 'center',
  },
  navIconCircleArrived: { backgroundColor: '#2E7D32' },
  navBannerText: { flex: 1 },
  navInstruction: { color: '#fff', fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  navDistToNext:  { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 2 },
  navBannerRight: { alignItems: 'flex-end', gap: 8 },
  navDistRemaining: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  endNavBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  endNavBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  // ── Map overlay buttons ──────────────────────────────────────────────
  settingsBtn: {
    position: 'absolute', right: 16,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    ...SHADOW_CARD,
    zIndex: 10,
  },
  accessibleBtn: {
    position: 'absolute', right: 66,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    ...SHADOW_CARD,
    zIndex: 10,
  },
  accessibleBtnActive: { backgroundColor: '#1565C0' },
  satelliteBtn: {
    position: 'absolute', right: 116,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    ...SHADOW_CARD,
    zIndex: 10,
  },

  // ── Bottom sheet ─────────────────────────────────────────────────────
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

  routeBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#EFE0FF',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4,
  },
  routeBadgeText: { color: '#5A0890', fontSize: 12, fontWeight: '600' },

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

  // ── Route-ready card ──────────────────────────────────────────────────
  routeReadyCard: {
    marginHorizontal: 16, marginBottom: 10,
    backgroundColor: '#F7F2FF',
    borderRadius: 18, padding: 14,
    borderWidth: 1.5, borderColor: '#DFC8F8',
  },
  routeReadyInfo: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 12,
  },
  routeReadyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#7209B7', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  routeReadyBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  routeReadyDist:      { color: '#5A0890', fontSize: 15, fontWeight: '700' },
  startNavBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#1565C0',
    borderRadius: 14, paddingVertical: 14,
    ...Platform.select({
      ios:     { shadowColor: '#1565C0', shadowOpacity: 0.45, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 5 },
    }),
  },
  startNavBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  routeReadyClose: {
    position: 'absolute', top: 4, left: 10,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#EEE',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 1,
  },
  reportPathBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, marginTop: 10,
  },
  reportPathBtnText: { color: '#8A6AAC', fontSize: 12, fontWeight: '500' },
});
