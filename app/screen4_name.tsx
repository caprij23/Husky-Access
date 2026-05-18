import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingProgress from '../components/OnboardingProgress';

export default function NameScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
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
              placeholderTextColor="#bbb"
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
              placeholderTextColor="#bbb"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.btn, (!firstName || !lastName) && styles.btnDisabled]}
        onPress={() => router.replace('/screen5_dob')}
        disabled={!firstName || !lastName}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingBottom: 24 },
  header: { paddingTop: 8, marginBottom: 24 },
  back: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F5EEFF', justifyContent: 'center', alignItems: 'center',
  },
  body:    { flex: 1 },
  heading: { fontSize: 28, fontWeight: '800', color: '#1a1a1a', marginBottom: 8, letterSpacing: -0.4 },
  sub:     { fontSize: 14, color: '#777', marginBottom: 32, lineHeight: 21 },
  fields:  { gap: 20 },
  field:   { gap: 8 },
  label:   { fontSize: 13, fontWeight: '600', color: '#444' },
  input: {
    backgroundColor: '#F7F3FF', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 16, color: '#1a1a1a',
    borderWidth: 1.5, borderColor: '#E8D8F8',
  },
  btn: {
    backgroundColor: '#7209B7', borderRadius: 50,
    paddingVertical: 18, alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#C9A8E8' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
