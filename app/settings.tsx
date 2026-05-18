import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Group 1 */}
        <View style={styles.group}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowIcon}>👤</Text>
            <Text style={styles.rowLabel}>Account</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowIcon}>🔔</Text>
            <Text style={styles.rowLabel}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#ddd', true: '#9B59B6' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowIcon}>🌙</Text>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#ddd', true: '#9B59B6' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowIcon}>🌐</Text>
            <Text style={styles.rowLabel}>Language</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Group 2 */}
        <View style={styles.group}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowIcon}>♿</Text>
            <Text style={styles.rowLabel}>Accessibility Settings</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowIcon}>🔒</Text>
            <Text style={styles.rowLabel}>Privacy Policy</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowIcon}>ℹ️</Text>
            <Text style={styles.rowLabel}>Help</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Group 3 */}
        <View style={styles.group}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowIcon}>👥</Text>
            <Text style={styles.rowLabel}>Invite a friend</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowIcon}>🚪</Text>
            <Text style={styles.rowLabel}>Logout</Text>
          </TouchableOpacity>
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
    gap: 16,
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
  divider: {
    height: 1,
    backgroundColor: '#f2f2f7',
    marginLeft: 52,
  },
});