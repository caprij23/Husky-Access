import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function KaneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Full-screen interior image */}
      <Image
        source={{ uri: 'https://facilities.uw.edu/files/2024/01/kane-hall-interior-hallway.jpg' }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        // Fallback dark background shows if image 404s
      />
      {/* Dark overlay for legibility */}
      <View style={styles.overlay} />

      {/* Header row */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#333" />
        </TouchableOpacity>

        <View style={styles.titlePill}>
          <Text style={styles.titleText}>My HuskyAccess</Text>
        </View>

        <TouchableOpacity style={styles.circleBtn}>
          <Ionicons name="settings-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Kane chip */}
      <View style={[styles.chipRow, { top: insets.top + 72 }]}>
        <View style={styles.kaneBadge}>
          <Text style={styles.kaneText}>Kane</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2a1a10' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  header: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingBottom: 10,
    gap: 8,
    zIndex: 10,
  },
  circleBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center', alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
      android: { elevation: 2 },
    }),
  },
  titlePill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 22,
    paddingHorizontal: 14, paddingVertical: 10,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
      android: { elevation: 2 },
    }),
  },
  titleText: { fontSize: 15, fontWeight: '600', color: '#222' },
  chipRow: {
    position: 'absolute', left: 0, right: 0,
    paddingHorizontal: 16, zIndex: 10,
  },
  kaneBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4A0072',
    paddingHorizontal: 18, paddingVertical: 9,
    borderRadius: 20,
  },
  kaneText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
