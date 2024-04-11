import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Screen() {
  const router = useRouter();

  const [completed, setCompleted] = useState(false);

  const handleRecording = () => {
    // Implement recording logic here
  };

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={false}
    >
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity onPress={() => {}}>
                <Text
                  style={[
                    styles.headerRightText,
                    completed ? { color: Colors.tint } : { color: "gray" },
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>Hello! How are you?</Text>
          <TouchableOpacity
            onPress={handleRecording}
            style={styles.recordButton}
          >
            <Feather name="mic" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Press the audio icon to start recording
          </Text>
        </View>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>2/</Text>
          <Text style={styles.finalProgressText}>25</Text>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerRightText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "90%",
  },
  bodyText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  recordButton: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0E5E5",
  },
  instructions: {
    fontSize: 16,
    marginTop: 30,
    color: Colors.secondaryText,
    textAlign: "center",
  },
  progressTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    bottom: 0,
  },
  progressText: {
    fontSize: 18,
    color: Colors.tint,
  },
  finalProgressText: {
    fontSize: 18,
    color: Colors.secondaryText,
  },
});
