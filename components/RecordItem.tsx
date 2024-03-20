import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type RecordItemProps = {
  id: string;
  name: string;
  recordId: string;
  onPress: () => void;
};

export default function RecordItem({
  name,
  recordId,
  onPress,
}: RecordItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.recordItem,
        pressed && styles.pressedRecordItem,
      ]}
    >
      {({ pressed }) => (
        <>
          <View style={styles.recordItemText}>
            <Text
              style={[styles.recordName, pressed && { color: Colors.tint }]}
            >
              {name}
            </Text>
            <Text style={styles.recordId}>Record id: {recordId}</Text>
          </View>
          <Feather
            name="chevron-right"
            size={24}
            color={pressed ? Colors.tint : "black"}
          />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  recordItem: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 30,
  },
  pressedRecordItem: {
    backgroundColor: "rgba(0,255,0,0.2)", // Light green tint
  },
  recordItemText: {
    display: "flex",
    flexDirection: "column",
  },
  recordName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  recordId: {
    color: "gray",
    fontSize: 14,
  },
});
