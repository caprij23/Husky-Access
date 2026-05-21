import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProgress from '../components/OnboardingProgress';

export default function NameScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');

  const opacity  = useRef(new Animated.Value(0)).current;
  const slideX   = useRef(new Animated.Value(28)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

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
    ]).start(() => router.push('/screen5_dob'));
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

        <OnboardingProgress step={1} />

        <View style={styles.body}>
          <Text style={styles.heading}>Tell us your name</Text>
          <Text style={styles.sub}>We'll use this to personalise your experience.</Text>

          <View style={styles.fields}>
            <View style={styles.field}>
              <Text style={styles.label}>First name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Alex"
                placeholderTextColor="#C0B0D8"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Johnson"
                placeholderTextColor="#C0B0D8"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                returnKeyType="done"
              />
            </View>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            style={[styles.btn, (!firstName || !lastName) && styles.btnDisabled]}
            onPress={handleContinue}
            disabled={!firstName || !lastName}
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
  screen:  { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingBottom: 24 },
  inner:   { flex: 1 },
  header:  { paddingTop: 8, marginBottom: 24 },
  back: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F3EAFF', justifyContent: 'center', alignItems: 'center',
  },
  body:    { flex: 1 },
  heading: { fontSize: 30, fontWeight: '800', letterSpacing: -0.6, color: '#111', marginBottom: 8 },
  sub:     { fontSize: 15, color: '#6B6B6B', marginBottom: 32, lineHeight: 22 },
  fields:  { gap: 20 },
  field:   { gap: 8 },
  label:   { fontSize: 13, fontWeight: '600', color: '#555', letterSpacing: 0.3 },
  input: {
    backgroundColor: '#F7F2FF', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 16 : 13,
    fontSize: 16, color: '#111',
    borderWidth: 1.5, borderColor: '#E4D4F8',
  },
  btn: {
    backgroundColor: '#7209B7', borderRadius: 50,
    paddingVertical: 18, alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#C9A8E8' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
});
