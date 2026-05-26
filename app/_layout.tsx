import { Stack } from 'expo-router';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PostsProvider } from '../context/PostsContext';
import { UserProvider } from '../context/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <PostsProvider>
        <SafeAreaProvider>
          <View style={styles.root}>
            <StatusBar translucent backgroundColor="transparent" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" options={{ animation: 'none' }} />
              <Stack.Screen name="screen_1_splash" options={{ animation: 'none' }} />
              <Stack.Screen name="screen2_welcome" options={{ animation: 'fade' }} />
              <Stack.Screen name="home" options={{ animation: 'none' }} />
              <Stack.Screen name="reportscreen_1" options={{ animation: 'none' }} />
              <Stack.Screen name="community" options={{ animation: 'none' }} />
              <Stack.Screen name="profile_page" options={{ animation: 'none' }} />
            </Stack>
          </View>
        </SafeAreaProvider>
      </PostsProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#9B59B6',
  },
});
