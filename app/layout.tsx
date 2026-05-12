import { Stack } from 'expo-router';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar translucent backgroundColor="transparent" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#9B59B6',
  },
});