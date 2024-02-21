import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Page from "@/components/Page";
import PrimaryButton from "@/components/PrimaryButton";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function Screen() {
  const router = useRouter();
  return (
    <Page style={{ flex: 1 }} headerShown={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Login</Text>
        </View>
        <View style={styles.bottomContainer}>
          <PrimaryButton
            onPress={() => {
              router.replace("/");
            }}
            type="large"
          >
            Login
          </PrimaryButton>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.secondaryButtonText}>Need Help?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  bottomContainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  secondaryButtonText: {
    color: Colors.tint,
    textAlign: "center",
    fontWeight: "bold",
  },
});
