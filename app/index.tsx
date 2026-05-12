import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9B59B6" />
      <Text style={styles.logo}>
        <Text style={styles.logoLight}>Husky</Text>
        <Text style={styles.logoBold}>Access</Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#9B59B6',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 0,
  padding: 0,
  },
  logo: {
    fontSize: 32,
  },
  logoLight: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '300',
  },
  logoBold: {
    color: '#ffffff',
    fontWeight: '800',
  },
});