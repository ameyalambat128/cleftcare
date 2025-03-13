import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import Colors from "@/constants/Colors";
import "react-native-get-random-values";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "@/i18n/locales/en.json";
import kn from "@/i18n/locales/kn.json";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "login",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
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
    const initializeLanguage = async () => {
      try {
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

    initializeLanguage();
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

  if (!loaded || !languageLoaded) {
    return null; // Render nothing while fonts or language are loading
  }

  return <RootLayoutNav isFirstLaunch={isFirstLaunch} />;
}

function RootLayoutNav({ isFirstLaunch }: { isFirstLaunch: boolean }) {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="record" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modals)/help-center"
            options={{
              title: "Help Center",
              headerShadowVisible: false,
              headerStyle: { backgroundColor: "white" },
              headerLeft: () => <View />,
              headerRight: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="close-outline" size={30} color="black" />
                </TouchableOpacity>
              ),
              presentation: "fullScreenModal",
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
