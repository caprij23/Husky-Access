import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProgress from '../components/OnboardingProgress';

export default function ProfileReadyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <OnboardingProgress step={5} />

      <View style={styles.body}>
        {/* Checkmark badge */}
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>

        <Text style={styles.heading}>You're all set!</Text>
        <Text style={styles.sub}>
          Your HuskyAccess profile is ready. Start navigating UW campus with accessible routes built just for you.
        </Text>

        {/* Feature highlights */}
        <View style={styles.features}>
          {[
            { icon: 'map-outline',           text: 'Accessible campus routes'      },
            { icon: 'people-outline',        text: 'Community reports & tips'      },
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
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace('/home')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Enter HuskyAccess</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 24 },
  body:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
    fontSize: 32, fontWeight: '800', color: '#1a1a1a',
    textAlign: 'center', marginBottom: 12, letterSpacing: -0.5,
  },
  sub: {
    fontSize: 15, color: '#777', textAlign: 'center',
    lineHeight: 23, marginBottom: 40, paddingHorizontal: 8,
  },
  features: { width: '100%', gap: 14 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7F3FF', borderRadius: 14,
    padding: 16, gap: 14,
  },
  featureIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#EDE0FF', justifyContent: 'center', alignItems: 'center',
  },
  featureText: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  footer: { width: '100%' },
  btn: {
    backgroundColor: '#7209B7', borderRadius: 50,
    paddingVertical: 18, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
