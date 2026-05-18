import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProgress from '../components/OnboardingProgress';

const OPTIONS = [
  { id: 'wheelchair', emoji: '♿', label: 'Wheelchair access',    sub: 'Ramps, accessible entrances' },
  { id: 'elevator',   emoji: '🛗', label: 'Elevator required',    sub: 'Avoid stairs entirely' },
  { id: 'vision',     emoji: '👁',  label: 'Visual assistance',   sub: 'High-contrast & audio cues' },
  { id: 'hearing',    emoji: '🦻', label: 'Hearing assistance',   sub: 'Visual alerts & signage' },
  { id: 'cognitive',  emoji: '🧠', label: 'Cognitive support',    sub: 'Clear, simple directions' },
  { id: 'navigation', emoji: '🗺', label: 'Campus navigation',    sub: 'First-time or infrequent visitor' },
];

export default function PreferencesScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <OnboardingProgress step={3} />

      <Text style={styles.heading}>How can we help you navigate?</Text>
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
              <Text style={styles.emoji}>{opt.emoji}</Text>
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

      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/screen7_upload')} activeOpacity={0.85}>
        <Text style={styles.btnText}>{selected.size === 0 ? 'Skip' : 'Continue'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingBottom: 24 },
  header:    { paddingTop: 8, marginBottom: 24 },
  back: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F5EEFF', justifyContent: 'center', alignItems: 'center',
  },
  heading:   { fontSize: 26, fontWeight: '800', color: '#1a1a1a', marginBottom: 6, letterSpacing: -0.3 },
  sub:       { fontSize: 14, color: '#777', marginBottom: 20, lineHeight: 20 },
  list:      { flex: 1, gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7F3FF', borderRadius: 14,
    padding: 14, gap: 12,
    borderWidth: 1.5, borderColor: '#F0E8FF',
  },
  optionActive: { backgroundColor: '#F0E0FF', borderColor: '#7209B7' },
  emoji:     { fontSize: 24, width: 32, textAlign: 'center' },
  optionText:{ flex: 1 },
  optionLabel:     { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  optionLabelActive:{ color: '#7209B7' },
  optionSub: { fontSize: 12, color: '#999', marginTop: 2 },
  check: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#DDD',
    justifyContent: 'center', alignItems: 'center',
  },
  checkActive: { backgroundColor: '#7209B7', borderColor: '#7209B7' },
  btn: {
    backgroundColor: '#7209B7', borderRadius: 50,
    paddingVertical: 18, alignItems: 'center', marginTop: 16,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
