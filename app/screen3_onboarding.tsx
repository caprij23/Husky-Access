import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  const opacity  = useRef(new Animated.Value(0)).current;
  const slideX   = useRef(new Animated.Value(28)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideX, { toValue: 0, tension: 90, friction: 11, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(() => router.push('/screen4_name'));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View style={[styles.inner, { opacity, transform: [{ translateX: slideX }] }]}>
        <View style={styles.imgWrap} />

        <View style={styles.middle}>
          <Text style={styles.heading}>Making UW accessible{'\n'}one step at a time.</Text>
        </View>

        <View style={styles.bottom}>
          <Animated.View style={{ width: '100%', transform: [{ scale: btnScale }] }}>
            <TouchableOpacity style={styles.btn} onPress={handlePress} activeOpacity={0.9}>
              <Text style={styles.btnText}>Create Account</Text>
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.dots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, backgroundColor: '#fdf0f4',
    paddingHorizontal: 24, paddingVertical: 36,
  },
  inner:   { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
  imgWrap: {
    width: '100%', aspectRatio: 16 / 9, borderRadius: 20,
    backgroundColor: '#c084fc',
  },
  middle:  { flex: 1, justifyContent: 'center', paddingVertical: 28, alignItems: 'center' },
  heading: {
    fontSize: Math.min(34, width * 0.082),
    fontWeight: '800',
    letterSpacing: -0.6,
    color: '#111',
    textAlign: 'center',
    lineHeight: Math.min(34, width * 0.082) * 1.25,
  },
  bottom:    { alignItems: 'center', gap: 20, width: '100%' },
  btn: {
    width: '100%', backgroundColor: '#7209B7',
    borderRadius: 50, paddingVertical: 18, alignItems: 'center',
  },
  btnText:   { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
  dots:      { flexDirection: 'row', gap: 8 },
  dot:       { width: 28, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.12)' },
  dotActive: { backgroundColor: '#7209B7' },
});
