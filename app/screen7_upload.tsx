import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProgress from '../components/OnboardingProgress';

export default function UploadScreen() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);

  // In production: use expo-image-picker here
  const pickPhoto = () => {
    // placeholder — integrate expo-image-picker when ready
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <OnboardingProgress step={4} />

      <View style={styles.body}>
        <Text style={styles.heading}>Add a profile photo</Text>
        <Text style={styles.sub}>Help others recognise you in the community.</Text>

        {/* Avatar circle */}
        <TouchableOpacity style={styles.avatar} onPress={pickPhoto} activeOpacity={0.8}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={56} color="#C9A8E8" />
            </View>
          )}
          <View style={styles.cameraBtn}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Options */}
        <View style={styles.options}>
          <TouchableOpacity style={styles.optionRow} onPress={pickPhoto} activeOpacity={0.75}>
            <View style={styles.optionIcon}>
              <Ionicons name="camera-outline" size={22} color="#7209B7" />
            </View>
            <Text style={styles.optionLabel}>Take a photo</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.optionRow} onPress={pickPhoto} activeOpacity={0.75}>
            <View style={styles.optionIcon}>
              <Ionicons name="images-outline" size={22} color="#7209B7" />
            </View>
            <Text style={styles.optionLabel}>Choose from library</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={() => router.replace('/screen8_profile')} activeOpacity={0.85}>
          <Text style={styles.btnText}>{photo ? 'Continue' : 'Skip for now'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingBottom: 24 },
  header:  { paddingTop: 8, marginBottom: 24 },
  back: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F5EEFF', justifyContent: 'center', alignItems: 'center',
  },
  body:    { flex: 1, alignItems: 'center' },
  heading: { fontSize: 28, fontWeight: '800', color: '#1a1a1a', marginBottom: 8, letterSpacing: -0.4, alignSelf: 'flex-start' },
  sub:     { fontSize: 14, color: '#777', marginBottom: 36, lineHeight: 21, alignSelf: 'flex-start' },
  avatar: {
    width: 140, height: 140, marginBottom: 40,
  },
  avatarPlaceholder: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#F5EEFF',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#E8D8F8',
  },
  avatarImg: { width: 140, height: 140, borderRadius: 70 },
  cameraBtn: {
    position: 'absolute', bottom: 4, right: 4,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#7209B7',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2.5, borderColor: '#fff',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 4 },
    }),
  },
  options: {
    width: '100%', backgroundColor: '#F7F3FF',
    borderRadius: 16, overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 14,
  },
  optionIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#EDE0FF', justifyContent: 'center', alignItems: 'center',
  },
  optionLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  divider: { height: 1, backgroundColor: '#EDE0FF', marginLeft: 70 },
  footer:  { width: '100%' },
  btn: {
    backgroundColor: '#7209B7', borderRadius: 50,
    paddingVertical: 18, alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
