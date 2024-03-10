import { StyleSheet, View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import Page from "@/components/Page";
import Colors from "@/constants/Colors";

export default function Screen() {
  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={true}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Feather
            name="search"
            size={20}
            color="#8E8E93"
            style={styles.icon}
          />
          <TextInput
            placeholder="Search name or record id"
            placeholderTextColor="#8E8E93"
            style={styles.input}
          />
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(25, 154, 142, 0.25)",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
});
