import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProgress from '../components/OnboardingProgress';

export default function DOBScreen() {
  const router  = useRouter();
  const [month, setMonth] = useState('');
  const [day,   setDay]   = useState('');
  const [year,  setYear]  = useState('');
  const dayRef  = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const opacity  = useRef(new Animated.Value(0)).current;
  const slideX   = useRef(new Animated.Value(28)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  const isComplete = month.length === 2 && day.length === 2 && year.length === 4;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(slideX, { toValue: 0, tension: 90, friction: 11, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(() => router.push('/screen6_preferences'));
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
                placeholderTextColor="#C0B0D8"
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
                placeholderTextColor="#C0B0D8"
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
                placeholderTextColor="#C0B0D8"
                keyboardType="number-pad"
                maxLength={4}
                value={year}
                onChangeText={setYear}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            style={[styles.btn, !isComplete && styles.btnDisabled]}
            onPress={handleContinue}
            disabled={!isComplete}
            activeOpacity={0.9}
          >
            <Text style={styles.btnText}>Continue</Text>
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
  body:      { flex: 1 },
  heading:   { fontSize: 30, fontWeight: '800', letterSpacing: -0.6, color: '#111', marginBottom: 8 },
  sub:       { fontSize: 15, color: '#6B6B6B', marginBottom: 36, lineHeight: 22 },
  dateRow:   { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  dateField: { flex: 1, gap: 8 },
  label:     { fontSize: 13, fontWeight: '600', color: '#555', textAlign: 'center', letterSpacing: 0.3 },
  dateInput: {
    backgroundColor: '#F7F2FF', borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 16 : 13,
    fontSize: 20, fontWeight: '700', color: '#111', textAlign: 'center',
    borderWidth: 1.5, borderColor: '#E4D4F8',
  },
  sep:       { fontSize: 24, color: '#C0B0D8', marginBottom: 14, marginHorizontal: 2 },
  btn: {
    backgroundColor: '#7209B7', borderRadius: 50,
    paddingVertical: 18, alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#C9A8E8' },
  btnText:   { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
});
