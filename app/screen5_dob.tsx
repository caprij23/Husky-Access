import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProgress from '../components/OnboardingProgress';

export default function DOBScreen() {
  const router  = useRouter();
  const [month, setMonth] = useState('');
  const [day,   setDay]   = useState('');
  const [year,  setYear]  = useState('');
  const dayRef  = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const isComplete = month.length === 2 && day.length === 2 && year.length === 4;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <OnboardingProgress step={2} />

      <View style={styles.body}>
        <Text style={styles.heading}>When were you born?</Text>
        <Text style={styles.sub}>We use your date of birth to verify your account.</Text>

        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <Text style={styles.label}>Month</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="MM"
              placeholderTextColor="#bbb"
              keyboardType="number-pad"
              maxLength={2}
              value={month}
              onChangeText={v => { setMonth(v); if (v.length === 2) dayRef.current?.focus(); }}
              returnKeyType="next"
            />
          </View>
          <Text style={styles.sep}>/</Text>
          <View style={styles.dateField}>
            <Text style={styles.label}>Day</Text>
            <TextInput
              ref={dayRef}
              style={styles.dateInput}
              placeholder="DD"
              placeholderTextColor="#bbb"
              keyboardType="number-pad"
              maxLength={2}
              value={day}
              onChangeText={v => { setDay(v); if (v.length === 2) yearRef.current?.focus(); }}
              returnKeyType="next"
            />
          </View>
          <Text style={styles.sep}>/</Text>
          <View style={[styles.dateField, { flex: 2 }]}>
            <Text style={styles.label}>Year</Text>
            <TextInput
              ref={yearRef}
              style={styles.dateInput}
              placeholder="YYYY"
              placeholderTextColor="#bbb"
              keyboardType="number-pad"
              maxLength={4}
              value={year}
              onChangeText={setYear}
              returnKeyType="done"
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.btn, !isComplete && styles.btnDisabled]}
        onPress={() => router.replace('/screen6_preferences')}
        disabled={!isComplete}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingBottom: 24 },
  header:   { paddingTop: 8, marginBottom: 24 },
  back: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F5EEFF', justifyContent: 'center', alignItems: 'center',
  },
  body:     { flex: 1 },
  heading:  { fontSize: 28, fontWeight: '800', color: '#1a1a1a', marginBottom: 8, letterSpacing: -0.4 },
  sub:      { fontSize: 14, color: '#777', marginBottom: 36, lineHeight: 21 },
  dateRow:  { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  dateField:{ flex: 1, gap: 8 },
  label:    { fontSize: 13, fontWeight: '600', color: '#444', textAlign: 'center' },
  dateInput: {
    backgroundColor: '#F7F3FF', borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 20, fontWeight: '600', color: '#1a1a1a', textAlign: 'center',
    borderWidth: 1.5, borderColor: '#E8D8F8',
  },
  sep:      { fontSize: 24, color: '#bbb', marginBottom: 14, marginHorizontal: 2 },
  btn: {
    backgroundColor: '#7209B7', borderRadius: 50,
    paddingVertical: 18, alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#C9A8E8' },
  btnText:  { color: '#fff', fontSize: 17, fontWeight: '700' },
});
