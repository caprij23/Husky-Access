import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props { step: number; total?: number; }

export default function OnboardingProgress({ step, total = 5 }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.seg, i < step ? styles.active : styles.inactive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row:      { flexDirection: 'row', gap: 6, marginBottom: 32 },
  seg:      { flex: 1, height: 4, borderRadius: 2 },
  active:   { backgroundColor: '#7209B7' },
  inactive: { backgroundColor: '#E0D0F0' },
});
