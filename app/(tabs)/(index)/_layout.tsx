import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function Layout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="search-record"
        options={{
          title: "Search",
          animation: "slide_from_bottom",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },

          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="add-record"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          headerLeft: () => <View />,
        }}
      />
    </Stack>
  );
}
