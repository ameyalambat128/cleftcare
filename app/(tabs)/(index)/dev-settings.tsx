import { useEffect } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import { useDevSettingsStore } from "@/lib/store";

export default function DevSettingsScreen() {
  const router = useRouter();
  const { shortRecordingFlowEnabled, setShortRecordingFlowEnabled, initializeDevSettings } = useDevSettingsStore();

  useEffect(() => {
    initializeDevSettings();
  }, []);

  const handleToggle = async (value: boolean) => {
    await setShortRecordingFlowEnabled(value);
  };

  return (
    <Page style={{ flex: 1, backgroundColor: Colors.background }} headerShown={true}>
      <Stack.Screen
        options={{
          title: "Dev Settings",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Short Recording Flow</Text>
            <Text style={styles.settingDescription}>
              Enable to test with only prompts 1, 2, and 25 (skips prompts 3-17)
            </Text>
          </View>
          <Switch
            value={shortRecordingFlowEnabled}
            onValueChange={handleToggle}
            trackColor={{ false: "#767577", true: Colors.tint }}
            thumbColor={shortRecordingFlowEnabled ? "#fff" : "#f4f3f4"}
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.secondaryText,
    lineHeight: 20,
  },
});

