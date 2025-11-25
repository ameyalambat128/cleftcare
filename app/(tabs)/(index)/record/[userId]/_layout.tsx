import { Stack } from "expo-router";

const SCREEN_NAMES = [
  "index",
  "onboarding",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "twentyfive",
];

const screenOptions = {
  title: "Record Audio",
  headerShadowVisible: false,
  headerStyle: { backgroundColor: "white" },
};

export default function Layout() {
  return (
    <Stack>
      {SCREEN_NAMES.map((name) => (
        <Stack.Screen key={name} name={name} options={screenOptions} />
      ))}
    </Stack>
  );
}
