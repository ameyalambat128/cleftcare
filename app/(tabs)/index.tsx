import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import Page from "@/components/Page";

export default function Screen() {
  return (
    <Page style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Cleft Care</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.icon}>
            <Feather name="search" size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Feather name="edit" size={23} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Feather name="mail" size={25} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: 20,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    marginLeft: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
