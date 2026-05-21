import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProgress from '../components/OnboardingProgress';

export default function UploadScreen() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);

  const opacity  = useRef(new Animated.Value(0)).current;
  const slideX   = useRef(new Animated.Value(28)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(slideX, { toValue: 0, tension: 90, friction: 11, useNativeDriver: true }),
    ]).start();
  }, []);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera access needed', 'Please allow camera access in Settings to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Photo library access needed', 'Please allow photo library access in Settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(() => router.push('/screen8_profile'));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <Animated.View style={[styles.inner, { opacity, transform: [{ translateX: slideX }] }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Ionicons name="chevron-back" size={22} color="#111" />
          </TouchableOpacity>
        </View>

        <OnboardingProgress step={4} />

        <View style={styles.body}>
          <Text style={styles.heading}>Add a profile photo</Text>
          <Text style={styles.sub}>Help others recognise you in the community.</Text>

          <TouchableOpacity style={styles.avatar} onPress={takePhoto} activeOpacity={0.8}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={56} color="#C0A8E8" />
              </View>
            )}
            <View style={styles.cameraBtn}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.options}>
            <TouchableOpacity style={styles.optionRow} onPress={takePhoto} activeOpacity={0.75}>
              <View style={styles.optionIcon}>
                <Ionicons name="camera-outline" size={22} color="#7209B7" />
              </View>
              <Text style={styles.optionLabel}>Take a photo</Text>
              <Ionicons name="chevron-forward" size={18} color="#C0B0D8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.optionRow} onPress={pickFromLibrary} activeOpacity={0.75}>
              <View style={styles.optionIcon}>
                <Ionicons name="images-outline" size={22} color="#7209B7" />
              </View>
              <Text style={styles.optionLabel}>Choose from library</Text>
              <Ionicons name="chevron-forward" size={18} color="#C0B0D8" />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity style={styles.btn} onPress={handleContinue} activeOpacity={0.9}>
            <Text style={styles.btnText}>{photo ? 'Continue' : 'Skip for now'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingBottom: 24 },
  inner:   { flex: 1 },
  header:  { paddingTop: 8, marginBottom: 24 },
  back: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F3EAFF', justifyContent: 'center', alignItems: 'center',
  },
  body:    { flex: 1, alignItems: 'center' },
  heading: { fontSize: 30, fontWeight: '800', letterSpacing: -0.6, color: '#111', marginBottom: 8, alignSelf: 'flex-start' },
  sub:     { fontSize: 15, color: '#6B6B6B', marginBottom: 36, lineHeight: 22, alignSelf: 'flex-start' },
  avatar:  { width: 140, height: 140, marginBottom: 40 },
  avatarPlaceholder: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#F3EAFF',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#E4D4F8',
  },
  avatarImg: { width: 140, height: 140, borderRadius: 70 },
  cameraBtn: {
    position: 'absolute', bottom: 4, right: 4,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#7209B7',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2.5, borderColor: '#fff',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 4 },
    }),
  },
  options: {
    width: '100%', backgroundColor: '#F7F2FF',
    borderRadius: 18, overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 14,
  },
  optionIcon: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#EDE0FF', justifyContent: 'center', alignItems: 'center',
  },
  optionLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: '#111' },
  divider:     { height: 1, backgroundColor: '#EDE0FF', marginLeft: 72 },
  btn: {
    backgroundColor: '#7209B7', borderRadius: 50,
    paddingVertical: 18, alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
});
