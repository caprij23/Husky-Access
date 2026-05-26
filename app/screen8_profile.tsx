import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { todayFormatted, useUser } from '../context/UserContext';
import { Animated, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProgress from '../components/OnboardingProgress';

export default function ProfileReadyScreen() {
  const router = useRouter();
  const { setJoinDate } = useUser();

  const badgeScale     = useRef(new Animated.Value(0.4)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentX       = useRef(new Animated.Value(20)).current;
  const btnScale       = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.spring(badgeScale, { toValue: 1, tension: 45, friction: 5, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(contentOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.spring(contentX, { toValue: 0, tension: 90, friction: 11, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleEnter = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(() => {
      setJoinDate(todayFormatted());
      router.replace('/home');
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <OnboardingProgress step={5} />

      <View style={styles.body}>
        <Animated.View style={[styles.badge, { transform: [{ scale: badgeScale }] }]}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </Animated.View>

        <Animated.View style={{ alignItems: 'center', width: '100%', opacity: contentOpacity, transform: [{ translateX: contentX }] }}>
          <Text style={styles.heading}>You're all set!</Text>
          <Text style={styles.sub}>
            Your HuskyAccess profile is ready. Start navigating UW campus with accessible routes built just for you.
          </Text>

          <View style={styles.features}>
            {[
              { icon: 'map-outline',           text: 'Accessible campus routes'       },
              { icon: 'people-outline',        text: 'Community reports & tips'       },
              { icon: 'notifications-outline', text: 'Real-time accessibility alerts' },
            ].map(({ icon, text }) => (
              <View key={text} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={icon as any} size={20} color="#7209B7" />
                </View>
                <Text style={styles.featureText}>{text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      <Animated.View style={{ transform: [{ scale: btnScale }] }}>
        <TouchableOpacity style={styles.btn} onPress={handleEnter} activeOpacity={0.9}>
          <Text style={styles.btnText}>Enter HuskyAccess</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 24 },
  body:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#7209B7',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 28,
    ...Platform.select({
      ios:     { shadowColor: '#7209B7', shadowOpacity: 0.45, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 8 },
    }),
  },
  heading: {
    fontSize: 34, fontWeight: '800', letterSpacing: -0.7, color: '#111',
    textAlign: 'center', marginBottom: 12,
  },
  sub: {
    fontSize: 15, color: '#6B6B6B', textAlign: 'center',
    lineHeight: 23, marginBottom: 40, paddingHorizontal: 8,
  },
  features:   { width: '100%', gap: 12 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7F2FF', borderRadius: 16,
    padding: 16, gap: 14,
  },
  featureIcon: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#EDE0FF', justifyContent: 'center', alignItems: 'center',
  },
  featureText: { fontSize: 15, fontWeight: '500', color: '#111', letterSpacing: -0.1 },
  btn: {
    backgroundColor: '#7209B7', borderRadius: 50,
    paddingVertical: 18, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
});
