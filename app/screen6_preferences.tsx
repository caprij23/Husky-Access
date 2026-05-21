import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProgress from '../components/OnboardingProgress';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const OPTIONS: { id: string; icon: IoniconName; label: string; sub: string }[] = [
  { id: 'wheelchair', icon: 'accessibility-outline',   label: 'Wheelchair access',    sub: 'Ramps, accessible entrances' },
  { id: 'elevator',   icon: 'arrow-up-circle-outline', label: 'Elevator required',    sub: 'Avoid stairs entirely' },
  { id: 'vision',     icon: 'eye-outline',             label: 'Visual assistance',    sub: 'High-contrast & audio cues' },
  { id: 'hearing',    icon: 'volume-medium-outline',   label: 'Hearing assistance',   sub: 'Visual alerts & signage' },
  { id: 'cognitive',  icon: 'bulb-outline',            label: 'Cognitive support',    sub: 'Clear, simple directions' },
  { id: 'navigation', icon: 'navigate-outline',        label: 'Campus navigation',    sub: 'First-time or infrequent visitor' },
];

export default function PreferencesScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const opacity  = useRef(new Animated.Value(0)).current;
  const slideX   = useRef(new Animated.Value(28)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(slideX, { toValue: 0, tension: 90, friction: 11, useNativeDriver: true }),
    ]).start();
  }, []);

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleContinue = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(() => router.push('/screen7_upload'));
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

        <OnboardingProgress step={3} />

        <Text style={styles.heading}>How can we help{'\n'}you navigate?</Text>
        <Text style={styles.sub}>Select all that apply. You can change these later.</Text>

        <View style={styles.list}>
          {OPTIONS.map(opt => {
            const active = selected.has(opt.id);
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.option, active && styles.optionActive]}
                onPress={() => toggle(opt.id)}
                activeOpacity={0.75}
              >
                <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                  <Ionicons name={opt.icon} size={22} color={active ? '#7209B7' : '#8B6BAE'} />
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{opt.label}</Text>
                  <Text style={styles.optionSub}>{opt.sub}</Text>
                </View>
                <View style={[styles.check, active && styles.checkActive]}>
                  {active && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity style={styles.btn} onPress={handleContinue} activeOpacity={0.9}>
            <Text style={styles.btnText}>{selected.size === 0 ? 'Skip' : 'Continue'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingBottom: 24 },
  inner:     { flex: 1 },
  header:    { paddingTop: 8, marginBottom: 24 },
  back: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F3EAFF', justifyContent: 'center', alignItems: 'center',
  },
  heading:   { fontSize: 30, fontWeight: '800', letterSpacing: -0.6, color: '#111', marginBottom: 8 },
  sub:       { fontSize: 15, color: '#6B6B6B', marginBottom: 18, lineHeight: 22 },
  list:      { flex: 1, gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7F2FF', borderRadius: 16,
    padding: 14, gap: 12,
    borderWidth: 1.5, borderColor: '#EDE3FC',
  },
  optionActive:      { backgroundColor: '#EFE0FF', borderColor: '#7209B7' },
  iconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#EDE3FC',
    justifyContent: 'center', alignItems: 'center',
  },
  iconWrapActive:    { backgroundColor: '#DFC8F8' },
  optionText:        { flex: 1 },
  optionLabel:       { fontSize: 15, fontWeight: '600', color: '#111', letterSpacing: -0.1 },
  optionLabelActive: { color: '#5A0890' },
  optionSub:         { fontSize: 12, color: '#8A7AA0', marginTop: 2, lineHeight: 17 },
  check: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#D0BEF0',
    justifyContent: 'center', alignItems: 'center',
  },
  checkActive: { backgroundColor: '#7209B7', borderColor: '#7209B7' },
  btn: {
    backgroundColor: '#7209B7', borderRadius: 50,
    paddingVertical: 18, alignItems: 'center', marginTop: 14,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
});
