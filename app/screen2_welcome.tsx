import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/uw_bg_huskyaccess.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <Animated.View style={[styles.content, { opacity: fade }]}>
          <Text style={styles.title}>Welcome</Text>
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.btn} onPress={() => router.replace('/screen3_onboarding')} activeOpacity={0.85}>
              <Text style={styles.btnText}>Let's get started</Text>
            </TouchableOpacity>
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotActive]} />
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
  bg:       { flex: 1 },
  safe:     { flex: 1 },
  content:  { flex: 1, justifyContent: 'space-between' },
  title: {
    color: '#CC44FF', fontSize: 44, fontWeight: '800',
    textAlign: 'center', marginTop: 80,
    textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4,
  },
  bottom:   { alignItems: 'center', paddingBottom: 24, gap: 20 },
  btn: {
    backgroundColor: '#7209B7', paddingVertical: 16, paddingHorizontal: 60, borderRadius: 30,
  },
  btnText:  { color: '#fff', fontSize: 16, fontWeight: '600' },
  dots:     { flexDirection: 'row', gap: 8 },
  dot:      { width: 20, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive:{ backgroundColor: '#7209B7', width: 28 },
});
