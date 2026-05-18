import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccessibilityScreen() {
  const router = useRouter();
  const [textSize, setTextSize] = useState(0.3);
  const [textToSpeech, setTextToSpeech] = useState(true);

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

      <View style={styles.content}>
        <View style={styles.group}>

          {/* Color Settings → navigates to color-settings screen */}
          <TouchableOpacity style={styles.row} onPress={() => router.push('/color-settings')}>
            <Text style={styles.rowIcon}>🎨</Text>
            <Text style={styles.rowLabel}>Color Settings</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Text Size */}
          <View style={styles.row}>
            <Text style={styles.rowIcon}>Aa</Text>
            <Text style={styles.rowLabel}>Text Size</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={textSize}
              onValueChange={setTextSize}
              minimumTrackTintColor="#9B59B6"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#9B59B6"
            />
          </View>

          <View style={styles.divider} />

          {/* Text to Speech */}
          <View style={styles.row}>
            <Text style={styles.rowIcon}>📄</Text>
            <Text style={styles.rowLabel}>Text to Speech</Text>
            <Switch
              value={textToSpeech}
              onValueChange={setTextToSpeech}
              trackColor={{ false: '#ddd', true: '#9B59B6' }}
              thumbColor="#fff"
            />
          </View>

        </View>
      </View>
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
  content: {
    padding: 16,
  },
  group: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
    color: '#333',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    color: '#1c1c1e',
  },
  chevron: {
    fontSize: 20,
    color: '#c7c7cc',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#f2f2f7',
    marginLeft: 52,
  },
});