import Page from "@/components/Page";
import { StyleSheet, Text, View } from "react-native";

export default function Screen() {
  return (
    <Page style={{ flex: 1 }} headerShown={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
