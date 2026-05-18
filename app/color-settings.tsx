import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

const ColorBlindIcon = ({ type }: { type: 'red-green' | 'blue-yellow' | 'mono' }) => {
  if (type === 'red-green') {
    return (
      <Svg width={80} height={60} viewBox="0 0 80 60">
        <Circle cx="28" cy="30" r="22" fill="#E63946" opacity={0.9} />
        <Circle cx="52" cy="30" r="22" fill="#2D6A2D" opacity={0.85} />
      </Svg>
    );
  }
  if (type === 'blue-yellow') {
    return (
      <Svg width={80} height={60} viewBox="0 0 80 60">
        <Circle cx="28" cy="30" r="22" fill="#2196F3" opacity={0.9} />
        <Circle cx="52" cy="30" r="22" fill="#F5C842" opacity={0.85} />
      </Svg>
    );
  }
  return (
    <Svg width={80} height={60} viewBox="0 0 80 60">
      <Circle cx="28" cy="30" r="22" fill="#aaa" opacity={0.9} />
      <Circle cx="52" cy="30" r="22" fill="#333" opacity={0.85} />
    </Svg>
  );
};

const colorOptions = [
  { id: 'red-green', label: 'Red-Green Color\nBlindness' },
  { id: 'blue-yellow', label: 'Blue-Yellow Color\nBlindness' },
  { id: 'mono', label: 'Monochromacy\nColor Blindness' },
] as const;

export default function ColorSettingsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accessibility Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.group}>
          <View style={styles.optionsRow}>
            {colorOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.option,
                  selected === option.id && styles.optionSelected,
                ]}
                onPress={() => setSelected(option.id)}
              >
                <ColorBlindIcon type={option.id} />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f2f2f7',
  },
  backArrow: {
    fontSize: 32,
    color: '#333',
    lineHeight: 36,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  headerSpacer: {
    width: 24,
  },
  scroll: {
    padding: 16,
  },
  group: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: '#9B59B6',
    backgroundColor: '#f5eeff',
  },
  optionLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: '#333',
    marginTop: 6,
    lineHeight: 15,
  },
});