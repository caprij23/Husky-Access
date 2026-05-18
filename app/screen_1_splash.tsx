import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace('/screen2_welcome'), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#7209B7" />
      <Text style={styles.logo}>
        <Text style={styles.husky}>Husky</Text>
        <Text style={styles.access}>Access</Text>
      </Text>
      <Text style={styles.sub}>Navigate UW, your way.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#7209B7', justifyContent: 'center', alignItems: 'center', gap: 12 },
  logo:   { fontSize: 38 },
  husky:  { color: 'rgba(255,255,255,0.75)', fontWeight: '300' },
  access: { color: '#fff', fontWeight: '800' },
  sub:    { color: 'rgba(255,255,255,0.6)', fontSize: 15 },
});
