import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type RecordItemProps = {
  userId: string;
  name: string;
  birthDate: string | null;
  onPress: () => void;
};

export default function RecordItem({
  userId,
  name,
  birthDate,
  onPress,
}: RecordItemProps) {
  const formatBirthDate = (dateString: string | null): string => {
    if (!dateString) return "Not available";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Not available";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString(undefined, options);
  };

  const formattedBirthDate = formatBirthDate(birthDate);
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
            <Text style={styles.recordId}>
              Birth Date: {formattedBirthDate}
            </Text>
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
    backgroundColor: "rgba(25, 154, 142, 0.25)",
    borderColor: "rgba(25, 154, 142, 0.25)",
    color: Colors.tint,
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
    color: Colors.secondaryText,
    fontSize: 14,
  },
});
