import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import RecordItem from "@/components/RecordItem";
import { UserInfo } from "@/lib/store";
import { useTranslation } from "react-i18next";

export default function Screen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { records } = useLocalSearchParams();
  const [query, setQuery] = useState<string>("");
  const [filteredRecords, setFilteredRecords] = useState([]);

  const allRecords = Array.isArray(records)
    ? records
    : records
    ? JSON.parse(records)
    : [];

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredRecords([]); // Set filtered records to an empty array
    } else {
      const results = allRecords.filter((record: any) => {
        const searchQuery = query.toLowerCase();
        return (
          record.name.toLowerCase().includes(searchQuery) ||
          record.userId.toLowerCase().includes(searchQuery)
        );
      });
      setFilteredRecords(results);
    }
  }, [query]);

  const handleEditRecordPress = (userId: string) => {
    router.push(`/edit-record/${userId}`); // Navigate to edit screen
  };

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={true}
    >
      <View style={styles.container}>
        {/* Search Input */}
        <View style={styles.inputContainer}>
          <Feather
            name="search"
            size={20}
            color="#8E8E93"
            style={styles.icon}
          />
          <TextInput
            placeholder={t("searchScreen.searchPlaceholder")}
            placeholderTextColor="#8E8E93"
            style={styles.input}
            value={query}
            onChangeText={(text) => setQuery(text)}
          />
        </View>

        {/* Search Results */}
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }: { item: UserInfo }) => (
            <RecordItem
              key={item.userId}
              userId={item.userId}
              name={item.name}
              birthDate={item.birthDate ? item.birthDate.toString() : null}
              onPress={() => handleEditRecordPress(item.userId)}
            />
          )}
          ListEmptyComponent={
            query ? (
              <Text style={styles.noResults}>
                {t("searchScreen.noResults")} "{query}"
              </Text>
            ) : (
              <Text style={styles.noResults}>{t("searchScreen.subtitle")}</Text>
            )
          }
        />
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
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recordName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  recordId: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  noResults: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: "center",
    marginTop: 20,
  },
});
