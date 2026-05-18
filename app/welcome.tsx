import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/uw_bg_huskyaccess.png')}
      style={styles.image}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Welcome</Text>

          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/screen3_onboarding')}
            >
              <Text style={styles.buttonText}>Lets get started</Text>
            </TouchableOpacity>

            <View style={styles.dots}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    color: '#CC44FF',
    fontSize: 42,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 80,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  bottomContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    gap: 20,
  },
  button: {
    backgroundColor: '#9B59B6',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeDot: {
    backgroundColor: '#9B59B6',
    width: 20,
  },
});