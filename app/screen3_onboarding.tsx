import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      {/* Gradient image placeholder — swap with <Image> of a UW building */}
      <View style={styles.imgWrap} />

      <View style={styles.middle}>
        <Text style={styles.heading}>Making UW accessible{'\n'}one step at a time.</Text>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btn} onPress={() => router.replace('/screen4_name')} activeOpacity={0.85}>
          <Text style={styles.btnText}>Create Account</Text>
        </TouchableOpacity>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, backgroundColor: '#fdf0f4',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 36,
  },
  imgWrap: {
    width: '100%', aspectRatio: 16 / 9, borderRadius: 18,
    backgroundColor: '#c084fc',
  },
  middle:   { flex: 1, justifyContent: 'center', paddingVertical: 28, alignItems: 'center' },
  heading: {
    fontSize: Math.min(32, width * 0.078), fontWeight: '800',
    color: '#1a1a1a', textAlign: 'center', lineHeight: Math.min(32, width * 0.078) * 1.28,
    letterSpacing: -0.4,
  },
  bottom:   { alignItems: 'center', gap: 20, width: '100%' },
  btn: {
    width: '100%', backgroundColor: '#7209B7',
    borderRadius: 50, paddingVertical: 18, alignItems: 'center',
  },
  btnText:  { color: '#fff', fontSize: 17, fontWeight: '600' },
  dots:     { flexDirection: 'row', gap: 8 },
  dot:      { width: 28, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.15)' },
  dotActive:{ backgroundColor: '#7209B7' },
});
