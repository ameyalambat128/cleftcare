import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Record Audio",
          // headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "transparent" },
        }}
      />
    </Stack>
  );
}
