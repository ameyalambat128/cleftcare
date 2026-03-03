import { Stack } from "expo-router";

const screenOptions = {
  title: "Record Audio",
  headerShadowVisible: false,
  headerStyle: { backgroundColor: "white" },
};

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="onboarding" options={screenOptions} />
      <Stack.Screen name="[promptNumber]" options={screenOptions} />
    </Stack>
  );
}
