import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import "react-native-get-random-values";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "@/i18n/locales/en.json";
import kn from "@/i18n/locales/kn.json";
import { useDevSettingsStore } from "@/lib/store";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "login",
};

const AUTH_SESSION_KEYS = ["user-id", "user-role", "user-email"];
let didResetAuthSessionForLaunch = false;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const resources = {
    en: { translation: en },
    kn: { translation: kn },
  };

  // Initialize i18next
  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (!didResetAuthSessionForLaunch) {
          await AsyncStorage.multiRemove(AUTH_SESSION_KEYS);
          didResetAuthSessionForLaunch = true;
        }

        // Check if a language is stored in AsyncStorage
        const storedLanguage = await AsyncStorage.getItem("user-language");
        const languageToSet = storedLanguage || "en"; // Default to English
        await i18n.use(initReactI18next).init({
          compatibilityJSON: "v4",
          resources,
          lng: languageToSet,
          fallbackLng: "en",
          interpolation: {
            escapeValue: false,
          },
        });
        setLanguageLoaded(true); // Mark i18n as initialized
      } catch (err) {
        console.error("Error initializing i18n:", err);
        setLanguageLoaded(true); // Proceed even if initialization fails
      }
    };

    initializeApp();
  }, []);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && languageLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, languageLoaded]);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(Colors.background);
  }, []);

  if (!loaded || !languageLoaded) {
    return null; // Render nothing while fonts or language are loading
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { initializeDevSettings } = useDevSettingsStore();

  useEffect(() => {
    initializeDevSettings();
  }, [initializeDevSettings]);

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: Colors.background }}
    >
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: Colors.background },
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
            statusBarStyle: "dark",
            statusBarBackgroundColor: Colors.background,
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modals)/help-center"
            options={{
              title: "Help Center",
              headerShadowVisible: false,
              headerStyle: { backgroundColor: "white" },
              headerLeft: () => <View />,
              presentation: "fullScreenModal",
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
