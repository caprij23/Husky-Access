import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  const titleOpacity  = useRef(new Animated.Value(0)).current;
  const titleX        = useRef(new Animated.Value(48)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomX       = useRef(new Animated.Value(32)).current;
  const btnScale      = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 620, useNativeDriver: true }),
        Animated.spring(titleX, { toValue: 0, tension: 55, friction: 8, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(bottomOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(bottomX, { toValue: 0, tension: 65, friction: 9, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(() => router.push('/screen3_onboarding'));
  };

  return (
    <ImageBackground
      source={require('../assets/images/uw_bg_huskyaccess.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.content}>
          <Animated.View style={{ opacity: titleOpacity, transform: [{ translateX: titleX }] }}>
            <Text style={styles.title}>Welcome</Text>
          </Animated.View>

          <Animated.View style={[styles.bottom, { opacity: bottomOpacity, transform: [{ translateX: bottomX }] }]}>
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity style={styles.btn} onPress={handlePress} activeOpacity={0.9}>
                <Text style={styles.btnText}>Let's get started</Text>
              </TouchableOpacity>
            </Animated.View>
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg:      { flex: 1 },
  safe:    { flex: 1 },
  content: { flex: 1, justifyContent: 'space-between' },
  title: {
    color: '#CC44FF',
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -1.5,
    textAlign: 'center',
    marginTop: 80,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
  },
  bottom:   { alignItems: 'center', paddingBottom: 24, gap: 20 },
  btn: {
    backgroundColor: '#7209B7', paddingVertical: 17, paddingHorizontal: 64, borderRadius: 30,
  },
  btnText:  { color: '#fff', fontSize: 17, fontWeight: '600', letterSpacing: 0.2 },
  dots:     { flexDirection: 'row', gap: 8 },
  dot:      { width: 20, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive:{ backgroundColor: '#7209B7', width: 28 },
});
